import { send } from "./utils/message";
import { createStateProxy } from "./utils/proxy";
import { HandlerResponse } from "./types/handler";
import { ActiveTabInfo, SavedLayout, WindowInfo } from "./types/window";
import { State } from "./contexts/WalletContext";
import { User } from "./types/user";
import { Message, MessageAction } from "./messaging/Action";

import initStatusHandker from "./messaging/background/init-status";
import checkStatusHandker from "./messaging/background/check-status";
import connectHandker from "./messaging/background/connect";
import signResultHandler from "./messaging/background/sign-result";
import solanaStatusHandler from "./messaging/background/solana-status";
import saveBookMarksHandler from "./messaging/background/save-bookmarks";
import createWindowHandler from "./messaging/background/create-window";
import saveLayoutHandler from "./messaging/background/save-layout";
import deleteLayoutHandler from "./messaging/background/delete-layout";
import openLayoutHandler from "./messaging/background/open-layout";
import closeLayoutHandler from "./messaging/background/close-layout";
import syncUserHandler from "./messaging/background/sync-user";
import forceConnectHandler from "./messaging/background/force-connect";

export type ExtensionGlobalState = State & {
  signHash?: string;
  tokenJwt?: string;
  waitingToConnect: boolean;
  isSigning: boolean;
  isConnecting: boolean;
  user?: User;
  activeTabInfo: ActiveTabInfo;
  managedWindows: Map<number, WindowInfo>;
  activeLayout?: SavedLayout;
  activeWindowId?: number;
};

const globalState: ExtensionGlobalState =
  createStateProxy<ExtensionGlobalState>(
    {
      waitingToConnect: false,
      isConnecting: false,
      isSigning: false,
      isPhantomAvailable: false,
      isWalletConnected: false,
      activeTabInfo: {
        id: null,
        isValid: false,
        url: "",
        title: "",
      },
      managedWindows: new Map(),
    },
    (obj) => {
      const {
        isConnecting,
        isSigning,
        isWalletConnected,
        isPhantomAvailable,
        waitingToConnect,
        signHash,
        activeTabInfo,
        managedWindows,
        activeLayout,
        ...stateToSave
      } = obj;

      chrome.storage.local.set({ state: stateToSave }, () => {
        console.debug("État sauvegardé dans le stockage");
      });
    }
  );

const tabTracker = new Map();
setupURLTracking();
let debounceTimer: NodeJS.Timeout | null = null;

const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      func(...args);
      debounceTimer = null;
    }, delay);
  };
};

const handlers: {
  [A in MessageAction]?: (params: {
    globalState: ExtensionGlobalState;
    message: Extract<Message, { action: A }>;
    sendResponse: (response?: any) => void;
  }) => HandlerResponse;
} = {
  initStatus: initStatusHandker,
  checkStatus: checkStatusHandker,
  connect: connectHandker,
  signResult: signResultHandler,
  solanaStatus: solanaStatusHandler,
  saveBookmarks: saveBookMarksHandler,
  createWindow: createWindowHandler,
  saveLayout: saveLayoutHandler,
  deleteLayout: deleteLayoutHandler,
  openLayout: openLayoutHandler,
  closeLayout: closeLayoutHandler,
  syncUser: syncUserHandler,
  forceConnect: forceConnectHandler,
};

let stateLoaded = new Promise((resolve) => {
  function loadState() {
    chrome.storage.local.get((data) => {
      const tmp: ExtensionGlobalState = data.state || {
        waitingToConnect: false,
        isConnecting: false,
        isSigning: false,
        isPhantomAvailable: false,
      };

      Object.keys(tmp).forEach((k) => {
        const key = k as keyof ExtensionGlobalState;
        (globalState as any)[key] = tmp[key];
      });

      if (globalState!.tokenJwt) {
        fetch(process.env.API_URL + "/api/me", {
          headers: {
            Authorization: "Bearer " + globalState!.tokenJwt,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.error) {
              console.debug("User disconnected");
              globalState!.user = undefined;
              globalState!.tokenJwt = undefined;
              send("popup", "loginStatus", {
                isConnecting: false,
                tokenJwt: json.token,
                user: json.user,
              });
            } else {
              globalState.user = json;
              send("popup", "loginStatus", {
                isConnecting: false,
              });
              send("popup", "config", json.config);
            }

            resolve(globalState);
          })
          .catch((e) => {
            console.debug(e);
            resolve(globalState);
          });
      } else {
        resolve(globalState);
      }
    });
  }

  loadState();
});

async function executeAfterStateLoaded(
  callback: (state: ExtensionGlobalState) => void
) {
  await stateLoaded;
  callback(globalState!);
}

executeAfterStateLoaded((state) => {
  send("popup", "solanaStatus", state);
  send("popup", "loginStatus", state);

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name == "popup") {
      port.onDisconnect.addListener(() => {
        state.isConnecting = false;
        state.isSigning = false;
        state.waitingToConnect = false;
      });
    }
  });

  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      if (
        message.target == "background" &&
        typeof "action" in message != undefined
      ) {
        if (Object.keys(handlers).includes(message.action)) {
          const params = { message, globalState: state, sendResponse };
          handlers[message.action]!(params as any);
        }
      }
    }
  );
});

chrome.runtime.onStartup.addListener(() => {
  console.debug(`onStartup()`);
});

function setupURLTracking() {
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId === 0) {
      chrome.tabs.get(details.tabId, (tab) => {
        if (chrome.runtime.lastError) return;

        if (tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT) {
          updateActiveTabData(details.tabId);
        }
      });
    }
  });

  chrome.webNavigation.onReferenceFragmentUpdated.addListener((details) => {
    if (details.frameId === 0) {
      chrome.tabs.get(details.tabId, (tab) => {
        if (chrome.runtime.lastError) return;

        if (tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT) {
          updateActiveTabData(details.tabId);
        }
      });
    }
  });

  chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    if (details.frameId === 0) {
      chrome.tabs.get(details.tabId, (tab) => {
        if (chrome.runtime.lastError) return;

        if (tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT) {
          updateActiveTabData(details.tabId);
        }
      });
    }
  });

  const pollInterval = 1000;
  setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        const currentTabId = tabs[0].id;
        const trackedInfo = tabTracker.get(currentTabId);

        if (!trackedInfo || trackedInfo.url !== tabs[0].url) {
          updateActiveTabData(currentTabId);
        }
      }
    });
  }, pollInterval);
}

function updateActiveTabData(tabId: number) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.warn("Error:", chrome.runtime.lastError);
      globalState.activeTabInfo.isValid = false;
      return;
    }

    globalState.activeWindowId = tab.windowId;

    if (globalState.managedWindows.has(tab.windowId)) return;

    const oldInfo = tabTracker.get(tabId);
    const hasChanged =
      !oldInfo || oldInfo.url !== tab.url || oldInfo.title !== tab.title;

    if (hasChanged) {
      globalState.activeTabInfo.id = tab.id!;
      globalState.activeTabInfo.url = tab.url || "";
      globalState.activeTabInfo.title = tab.title || "";
      globalState.activeTabInfo.isValid = true;

      send("popup", "currentUrl", globalState.activeTabInfo);

      tabTracker.set(tabId, {
        url: tab.url,
        title: tab.title,
        lastUpdated: Date.now(),
      });
    }
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeInfo.tabId !== undefined) {
    updateActiveTabData(activeInfo.tabId);
  } else {
    globalState.activeTabInfo.isValid = false;
    globalState.activeTabInfo.id = null;
    globalState.activeTabInfo.url = "";
    globalState.activeTabInfo.title = "";
    send("popup", "currentUrl", globalState.activeTabInfo);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.active &&
    tab.windowId === chrome.windows.WINDOW_ID_CURRENT &&
    tabId !== undefined
  ) {
    if (globalState.managedWindows.has(tab.windowId)) return;

    globalState.activeTabInfo.id = tabId;
    globalState.activeTabInfo.isValid = true;

    let hasUpdates = false;

    if (changeInfo.url !== undefined) {
      globalState.activeTabInfo.url = changeInfo.url;
      hasUpdates = true;
    }

    if (changeInfo.title !== undefined) {
      globalState.activeTabInfo.title = changeInfo.title;
      hasUpdates = true;
    }

    if (changeInfo.status === "complete") {
      setTimeout(() => updateActiveTabData(tabId), 100);
      return;
    }

    if (hasUpdates) {
      send("popup", "currentUrl", globalState.activeTabInfo);
    }
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.get(details.tabId, (tab) => {
      if (chrome.runtime.lastError) return;

      if (tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT) {
        setTimeout(() => updateActiveTabData(details.tabId), 200);
      }
    });
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0 && tabs[0].id !== undefined) {
    updateActiveTabData(tabs[0].id);
  } else {
    globalState.activeTabInfo.isValid = false;
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  setTimeout(trackFocusedWindow, 100);
});

const updateLayoutOnServer = (savedLayouts: SavedLayout[]) => {
  fetch(process.env.API_URL + "/api/layouts", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + globalState.tokenJwt,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ layouts: savedLayouts }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        globalState.user!.config.layouts = savedLayouts;
      }
    });
};

const debouncedUpdateLayout = debounce(updateLayoutOnServer, 1000);

chrome.windows.onBoundsChanged.addListener((window) => {
  if (globalState.managedWindows.has(window.id!)) {
    const windowInfo = globalState.managedWindows.get(window.id!);
    if (windowInfo) {
      windowInfo.position = {
        x: window.left || 0,
        y: window.top || 0,
      };
      windowInfo.size = {
        width: window.width || 800,
        height: window.height || 600,
      };
      globalState.managedWindows.set(window.id!, windowInfo);

      if (globalState.activeLayout) {
        const indexWindows = globalState.activeLayout.windows.findIndex(
          (w) => w.bookmarkId == windowInfo.bookmarkId
        );

        const savedLayouts: SavedLayout[] =
          globalState.user?.config.layouts || [];

        if (indexWindows >= 0) {
          globalState.activeLayout.windows[indexWindows] = windowInfo;

          const existingIndex = savedLayouts.findIndex(
            (l) => l.layout.id === globalState.activeLayout!.layout.id
          );

          savedLayouts[existingIndex] = globalState.activeLayout;
          debouncedUpdateLayout(savedLayouts);
        }
      }
    }
  }
});

function trackFocusedWindow() {
  chrome.windows.getLastFocused({ populate: true }, (focusedWindow) => {
    if (!focusedWindow) return;

    if (globalState.managedWindows.has(focusedWindow.id!)) return;
    const activeTab = focusedWindow.tabs?.find((tab) => tab.active);

    if (activeTab && activeTab.id !== undefined) {
      const tabId = activeTab.id;

      globalState.activeTabInfo.id = tabId;
      globalState.activeTabInfo.url = activeTab.url || "";
      globalState.activeTabInfo.title = activeTab.title || "";
      globalState.activeTabInfo.isValid = true;

      send("popup", "currentUrl", globalState.activeTabInfo);

      tabTracker.set(tabId, {
        url: activeTab.url,
        title: activeTab.title,
        lastUpdated: Date.now(),
      });
    }
  });
}

chrome.windows.onCreated.addListener(() => {
  setTimeout(trackFocusedWindow, 200);
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (globalState.managedWindows.has(windowId)) {
    send("popup", "windowStatusUpdate", {
      bookmarkId: globalState.managedWindows.get(windowId)!.bookmarkId,
      state: "CLOSED",
    });

    globalState.managedWindows.delete(windowId);

    if (globalState.activeLayout) {
      const windows = Array.from(globalState.managedWindows.values());

      const windowsStillsOpenned = globalState.activeLayout.windows.filter(
        (w) =>
          windows.find((w1) => w1.bookmarkId === w.bookmarkId) !== undefined
      );

      if (windowsStillsOpenned.length == 0) {
        globalState.activeLayout = undefined;
        send("popup", "currentActiveLayoutStatusUpdate", {
          layoutId: null,
        });
      }
    }
  }

  setTimeout(trackFocusedWindow, 200);
});

const pollInterval = 1000;
setInterval(() => {
  trackFocusedWindow();
}, pollInterval);
