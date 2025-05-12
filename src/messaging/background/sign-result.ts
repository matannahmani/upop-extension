import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "signResult" }>;
}): HandlerResponse {
  globalState.signHash = message.data.hash;
  globalState.isSigning = false;

  (chrome.action as any).openPopup().then(() => {
    send("popup", "loginStatus", {
      isConnecting: true,
    });

    if (!globalState.isConnecting) {
      fetch(
        process.env.API_URL +
          "/api/verify?publicAddress=" +
          globalState.publicKey +
          "&signature=" +
          globalState.signHash
      )
        .then((response) => response.json())
        .then((json) => {
          globalState.isConnecting = false;

          if (json.token) {
            globalState.tokenJwt = json.token;
            globalState.user = json.user;
            send("popup", "config", json.user.config);

            send("popup", "loginStatus", {
              isConnecting: false,
              tokenJwt: json.token,
              user: json.user,
            });
          } else {
            send("popup", "loginStatus", {
              isConnecting: false,
              error: json.message,
            });
          }
        })
        .catch((error) => {
          globalState.isConnecting = false;

          send("popup", "loginStatus", {
            isConnecting: false,
            error: "Unable to contact remote server, please try again",
          });
        });
    }
  });

  return false;
}
