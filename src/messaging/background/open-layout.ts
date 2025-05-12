import { SavedLayout, WindowInfo } from "../../types/window";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "openLayout" }>;
}): HandlerResponse {
  const windowIds = Array.from(globalState.managedWindows.keys());
  const savedLayouts: SavedLayout[] = globalState.user?.config.layouts || [];

  const existingIndex = savedLayouts.findIndex(
    (l) => l.layout.id === message.data.layoutId
  );

  if (existingIndex >= 0) {
    const layout = savedLayouts[existingIndex];

    const closePromises = windowIds.map((id) => {
      return new Promise<void>((resolve) => {
        chrome.windows.remove(id, () => {
          send("popup", "windowStatusUpdate", {
            bookmarkId: globalState.managedWindows.get(id)!.bookmarkId,
            state: "CLOSED",
          });
          globalState.managedWindows.delete(id);
          resolve();
        });
      });
    });

    Promise.all(closePromises).then(() => {
      const openPromises = layout.windows.map((windowInfo) => {
        return new Promise<void>((resolve) => {
          chrome.windows.create(
            {
              url: windowInfo.url,
              type: "popup",
              width: windowInfo.size.width,
              height: windowInfo.size.height,
              left: windowInfo.position.x,
              top: windowInfo.position.y,
              focused: true
            },
            (window) => {
              if (window && window.id) {
                const newWindowInfo: WindowInfo = {
                  id: window.id,
                  url: windowInfo.url,
                  bookmarkId: windowInfo.bookmarkId,
                  position: {
                    x: windowInfo.position.x,
                    y: windowInfo.position.y,
                  },
                  size: {
                    width: windowInfo.size.width,
                    height: windowInfo.size.height,
                  },
                };

                chrome.tabs.onUpdated.addListener(function listener(
                  tabId,
                  changeInfo,
                  tab
                ) {
                  if (tab.windowId === window.id && changeInfo.status === "complete") {
                    const url = tab.url;
                    let scriptToInject;
        
                    if (url!.includes("discord.com")) {
                      scriptToInject = "ui-injections/discord.js";
                    } else if (url!.includes("web.telegram.org")) {
                      scriptToInject = "ui-injections/telegram.js";
                    } else {
                      return;
                    }
        
                    chrome.scripting.executeScript({
                      target: { tabId: tab.id! },
                      files: [scriptToInject],
                    });
        
                    chrome.tabs.onUpdated.removeListener(listener);
                  }
                });

                globalState.managedWindows.set(window.id, newWindowInfo);
                send("popup", "windowStatusUpdate", {
                  bookmarkId: newWindowInfo.bookmarkId,
                  state: "OPENED",
                });
              } else {
                console.warn(window);
              }
              resolve();
            }
          );
        });
      });

      Promise.all(openPromises).then(() => {
        globalState.activeLayout = layout;

        send("popup", "currentActiveLayoutStatusUpdate", {
          layoutId: layout.layout.id,
        });
      });
    });
  }

  return false;
}
