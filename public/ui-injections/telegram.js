(function () {
  const TELEGRAM_SELECTORS = {
    sidebar: [
      "#LeftColumn",
      ".sidebar",
      ".column-left",
      '[class*="LeftColumn"]',
      ".chat-list",
      ".tabs-container",
    ],

    chatArea: [
      ".chat-content",
      ".column-middle",
      '[class*="RightColumn"]',
      ".messages-container",
      ".bubbles",
    ],
  };

  const STYLES = {
    hide: { display: "none" },
    fullWidth: { width: "100%", left: "0" },
    fullViewportWidth: { width: "100vw" },
  };

  function applyStyles(element, styles) {
    if (!element || !styles) return;

    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, "important");
    });
  }

  function findElement(selectors) {
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) return element;
      } catch (e) {}
    }
    return null;
  }

  function modifyTelegramUI() {
    const sidebar = findElement(TELEGRAM_SELECTORS.sidebar);
    if (sidebar) applyStyles(sidebar, STYLES.hide);
    const chatArea = findElement(TELEGRAM_SELECTORS.chatArea);
    if (chatArea) applyStyles(chatArea, STYLES.fullWidth);
    const messagesLayout = document.querySelector(".messages-layout");
    if (messagesLayout) applyStyles(messagesLayout, STYLES.fullViewportWidth);
  }

  function throttle(func, limit) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        func.apply(this, args);
        lastCall = now;
      }
    };
  }

  const throttledModify = throttle(modifyTelegramUI, 250);

  const observer = new MutationObserver(() => {
    throttledModify();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    modifyTelegramUI();
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      modifyTelegramUI();
    });
  }

  window.addEventListener(
    "unload",
    () => {
      observer.disconnect();
    },
    { once: true }
  );
})();
