(function () {
  function tryConnect(params?: any) {
    return window!.solana!.connect(params);
  }

  async function checkSolana() {
    let solanaInfo = {
      isPhantomAvailable: !!window.solana,
      isWalletConnected: window.solana ? !!window.solana.isConnected : false,
    };

    if (window.solana) {
      try {
        const data = await tryConnect({ onlyIfTrusted: true });
        console.debug("Connected onlytrusted", data)
        solanaInfo.isWalletConnected = true;
        window.postMessage(
          {
            type: "PHANTOM_PROVIDER_RESPONSE",
            action: "solanaStatus",
            data: {
              ...solanaInfo,
              publicKey: data.publicKey.toBase58(),
            },
          },
          "*"
        );
      } catch (e) {
        window.postMessage(
          {
            type: "PHANTOM_PROVIDER_RESPONSE",
            action: "solanaStatus",
            data: solanaInfo,
          },
          "*"
        );
      }
    } else {
      window.postMessage(
        {
          type: "PHANTOM_PROVIDER_RESPONSE",
          action: "solanaStatus",
          data: solanaInfo,
        },
        "*"
      );
    }
  }

  function connectSolana() {
    if (window.solana) {
      window.solana
        .connect()
        .then((data) => {
          window.postMessage(
            {
              type: "PHANTOM_PROVIDER_RESPONSE",
              action: "solanaStatus",
              data: {
                isPhantomAvailable: true,
                isWalletConnected: true,
                publicKey: data.publicKey.toBase58(),
              },
            },
            "*"
          );
        })
        .catch(function (error) {
          window.postMessage(
            {
              type: "PHANTOM_PROVIDER_RESPONSE",
              action: "solanaStatus",
              data: {
                isPhantomAvailable: true,
                isWalletConnected: false,
                error: error.toString(),
              },
            },
            "*"
          );
        });
    }
  }

  function signMessage(message: string) {
    if (window.solana) {
      window.solana
        .signMessage(new TextEncoder().encode(`${message}`))
        .then((data) => {
          window.postMessage(
            {
              type: "PHANTOM_PROVIDER_RESPONSE",
              action: "signResult",
              data: {
                hash: window.bs58.default.encode(data.signature),
              },
            },
            "*"
          );
        })
        .catch(function (error) {
          window.postMessage(
            {
              type: "PHANTOM_PROVIDER_RESPONSE",
              action: "signResult",
              data: {
                error: error.toString(),
              },
            },
            "*"
          );
        });
    }
  }

  window.addEventListener("message", function (event) {
    if (event.source !== window) return;

    const data = event.data;

    if (data && data.type === "PHANTOM_PROVIDER_REQUEST") {
      if (data.action === "connect") {
        connectSolana();
      } else if (data.action === "checkStatus") {
        checkSolana();
      } else if (data.action === "signMessage") {
        signMessage(data.data.message);
      }
    }
  });

  checkSolana();
})();
