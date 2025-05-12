import {
  MessageAction,
  MessageDataMap,
  MessageTarget,
} from "../messaging/Action";

const send = <A extends MessageAction>(
  target: MessageTarget,
  action: A,
  ...args: MessageDataMap[A] extends undefined
    ? [data?: MessageDataMap[A]]
    : [data: MessageDataMap[A]]
) => {
  const data = args[0];

  console.debug("Sending to " + target, { action, data });
  if (target == "popup" || target == "background") {
    chrome.runtime.sendMessage({
      action,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      target,
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (
        tabs.length === 0 ||
        (tabs[0] &&
          tabs[0].url &&
          (tabs[0].url.startsWith("chrome://") ||
            tabs[0].url.startsWith("chrome-extension://")))
      ) {
        chrome.tabs.create(
          { url: "https://upop.gg/extension", active: true },
          function (newTab) {
            function checkAndSendMessage() {
              chrome.tabs.get(newTab.id!, function (tab) {
                if (chrome.runtime.lastError) {
                  console.debug("Error:", chrome.runtime.lastError);
                  return;
                }

                if (tab.status === "complete") {
                  chrome.tabs.sendMessage(newTab.id!, {
                    action,
                    data: data ? JSON.parse(JSON.stringify(data)) : undefined,
                    target,
                  });
                } else {
                  setTimeout(checkAndSendMessage, 100);
                }
              });
            }
            setTimeout(checkAndSendMessage, 500);
          }
        );

        return;
      }

      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id!, {
        action,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined,
        target,
      });
    });
  }
};

export { send };
