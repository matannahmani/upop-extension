(function () {
  if (window.location.href !== "https://upop.gg/extension") return;

  let error: string | null = null;
  let loading = false;

  function modifyUPopInterface(): void {
    const errorMsg: HTMLElement | null = document.querySelector(
      "#hero > div.framer-1xjsefy > div.framer-fmttsc > div > div > div.framer-1midsiy > div.framer-1lgkwq8 > p"
    );

    if (error && errorMsg) {
      errorMsg.innerText = error;
      errorMsg.style.color = "red";
      errorMsg.style.fontWeight = "bold";
    }

    const buttonTextElement: HTMLElement | null = document.querySelector(
      "#hero > div.framer-1xjsefy > div.framer-fmttsc > div > div > div.framer-1midsiy > div.framer-1kh05dj > div > div > div > div > div.framer-1nlt1u6 > p"
    );

    if (
      buttonTextElement &&
      buttonTextElement.textContent !== "Connect with Phantom" &&
      !loading
    ) {
      buttonTextElement.textContent = "Connect with Phantom";
    }

    const clickableDiv: HTMLElement | null = document.querySelector(
      '[data-framer-appear-id="toefd6"]'
    );

    if (loading) {
      if (clickableDiv) {
        clickableDiv.style.cursor = "progress";
        clickableDiv.style.background = "#391cb3";
      }
      if (buttonTextElement) {
        buttonTextElement.textContent = "Loading...";
      }
    } else {
      if (clickableDiv) {
        clickableDiv.style.cursor = "pointer";
        clickableDiv.style.background =
          "linear-gradient(90deg, rgb(111, 79, 255) 0%, rgb(111, 79, 255) 100%)";
      }
    }

    if (clickableDiv) {
      if (!clickableDiv.hasAttribute("data-event-attached")) {
        clickableDiv.setAttribute("data-event-attached", "true");

        clickableDiv.addEventListener("click", function (event: MouseEvent) {
          event.preventDefault();
          event.stopPropagation();
          loading = true;

          const phantomAvailable = !!window.solana;

          if (!phantomAvailable) {
            error =
              "You don't have Phantom extension installed, you need to install it here first.";
            loading = false;
            return;
          }

          window!
            .solana!.connect()
            .then((data) => {
              const publicKey = data.publicKey.toBase58();

              fetch(
                process.env.API_URL + "/api/token?publicAddress=" + publicKey
              )
                .then((response) => response.json())
                .then((json) => {
                  window!
                    .solana!.signMessage(
                      new TextEncoder().encode(`${json.code}`)
                    )
                    .then((data) => {
                      fetch(
                        process.env.API_URL +
                          "/api/verify?publicAddress=" +
                          publicKey +
                          "&signature=" +
                          window.bs58.default.encode(data.signature)
                      )
                        .then((response) => response.json())
                        .then((json) => {
                          if (json.token) {
                            window.postMessage(
                              {
                                type: "PHANTOM_PROVIDER_RESPONSE",
                                action: "forceConnect",
                                data: json,
                              },
                              "*"
                            );
                          } else {
                            error = json.message;
                          }
                          loading = false;
                        })
                        .catch((e) => {
                          error =
                            "Unable to contact remote server, please try again";
                          loading = false;
                        });
                    })
                    .catch((e) => {
                      error = "You have declined the authenfication request.";
                      loading = false;
                    });
                });
            })
            .catch((e) => {
              error = "Unable to connect to phantom wallet.";
              loading = false;
            });
        });
      }
    }
  }

  function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): T {
    let lastCall = 0;
    return function (this: any, ...args: any[]): void {
      const now = Date.now();
      if (now - lastCall >= limit) {
        func.apply(this, args);
        lastCall = now;
      }
    } as T;
  }

  function checkPageReady(): boolean {
    const buttonTextElement = document.querySelector(
      "#hero > div.framer-1xjsefy > div.framer-fmttsc > div > div > div.framer-1midsiy > div.framer-1kh05dj > div > div > div > div > div.framer-1nlt1u6 > p"
    );

    const clickableDiv = document.querySelector(
      '[data-framer-appear-id="toefd6"]'
    );

    const allElementsReady = buttonTextElement && clickableDiv;

    if (allElementsReady) {
      throttledModify();
      return true;
    }
    return false;
  }

  function waitForPageLoad(): void {
    if (checkPageReady()) {
      return;
    }

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      if (checkPageReady()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("load", () => {
      if (checkPageReady()) {
        observer.disconnect();
      }
    });
  }

  const throttledModify = throttle(modifyUPopInterface, 250);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForPageLoad);
  } else {
    waitForPageLoad();
  }

  const mainObserver = new MutationObserver((mutations: MutationRecord[]) => {
    const shouldUpdate = mutations.some((mutation) => {
      if ((mutation.target as Element).hasAttribute("data-event-attached")) {
        return false;
      }

      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-event-attached"
      ) {
        return false;
      }

      return true;
    });

    if (shouldUpdate) {
      throttledModify();
    }
  });

  mainObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  window.addEventListener(
    "unload",
    () => {
      mainObserver.disconnect();
    },
    { once: true }
  );
})();
