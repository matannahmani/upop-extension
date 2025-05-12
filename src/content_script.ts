function injectScriptFile() {
  {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/injected.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
      script.remove();
    };
  }
  {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("bs58.bundle.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
      script.remove();
    };
  }
  {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/upop_connect.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
      script.remove();
    };
  }
}

function setupMessaging() {
  window.addEventListener("message", function (event) {
    if (event.source !== window) return;

    const data = event.data;

    if (data && data.type === "PHANTOM_PROVIDER_RESPONSE") {
      chrome.runtime.sendMessage({
        ...data,
        target: "background",
      });

      chrome.runtime.sendMessage({
        ...data,
        target: "popup",
      });
    }
  });
}

setupMessaging();
injectScriptFile();

chrome.runtime.onMessage.addListener((message) => {
  if (message.target == "content")
    window.postMessage(
      {
        ...message,
        type: "PHANTOM_PROVIDER_REQUEST",
        action: message.action || "connect",
      },
      "*"
    );
});
