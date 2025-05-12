import { WindowInfo } from "../../types/window";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { Message } from "../Action";
import { send } from "../../utils/message";

export default function handler({
  globalState,
  message,
  sendResponse,
}: HandlerParams & {
  message: Extract<Message, { action: "createWindow" }>;
}): HandlerResponse {
  let left = 100;
  let top = 100;

  if (globalState.managedWindows.size > 0) {
    const windows = Array.from(globalState.managedWindows.values());
    const lastWindow = windows[windows.length - 1];
    left = (lastWindow.position.x + 50) % 800;
    top = (lastWindow.position.y + 50) % 600;
  }


  chrome.windows.create(
    {
      url: message.data.url,
      type: "popup",
      width: 800,
      height: 600,
      left: left,
      top: top,
      focused: true,
    },
    (window) => {
      if (window && window.id) {
        
        const windowInfo: WindowInfo = {
          id: window.id,
          url: message.data.url,
          bookmarkId: message.data.id,
          position: {
            x: left,
            y: top,
          },
          size: {
            width: 800,
            height: 600,
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

        globalState.managedWindows.set(window.id, windowInfo);

        send("popup", "windowStatusUpdate", {
          bookmarkId: message.data.id,
          state: "OPENED",
        });

        sendResponse({ success: true, windowInfo });
      } else {
        sendResponse({ success: false, error: "Failed to create window" });
      }
    }
  );

  return true;
}
