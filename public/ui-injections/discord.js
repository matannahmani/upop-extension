(function () {
  const DISCORD_SELECTORS = {
    serverSidebar: [
      '[class*="guilds"]',
      'nav[class*="guild"]',
      '[aria-label="Servers sidebar"]',
      'ul[class*="listItem"]',
      'nav[class*="wrapper"]',
    ],

    channelSidebar: [
      '[class*="sidebar"]',
      '[class*="channelsList"]',
      '[aria-label="Channels sidebar"]',
      '[class*="container-"][class*="sidebar"]',
    ],

    chatArea: [
      '[class*="chat"]',
      '[class*="content"]',
      '[role="main"]',
      '[class*="chatContent"]',
    ],
  };

  const STYLES = {
    hide: { display: "none" },
    fullWidth: { width: "100%", left: "0" },
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

  function modifyDiscordUI() {
    const serverSidebar = findElement(DISCORD_SELECTORS.serverSidebar);
    if (serverSidebar) applyStyles(serverSidebar, STYLES.hide);

    const channelSidebar = findElement(DISCORD_SELECTORS.channelSidebar);
    if (channelSidebar) applyStyles(channelSidebar, STYLES.hide);

    const chatArea = findElement(DISCORD_SELECTORS.chatArea);
    if (chatArea) applyStyles(chatArea, STYLES.fullWidth);
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

  const throttledModify = throttle(modifyDiscordUI, 250);

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

    modifyDiscordUI();
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      modifyDiscordUI();
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
