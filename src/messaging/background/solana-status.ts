import { State } from "../../contexts/WalletContext";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "solanaStatus" }>;
}): HandlerResponse {
  const tmp = message.data;
  globalState.isPhantomAvailable = tmp.isPhantomAvailable;
  globalState.isWalletConnected = tmp.isWalletConnected;
  globalState.publicKey = tmp.publicKey;

  if (globalState.waitingToConnect && globalState.publicKey) {
    globalState.waitingToConnect = false;
    if (!globalState.isSigning) {
      globalState.isSigning = true;

      fetch(process.env.API_URL + "/api/token?publicAddress=" + tmp.publicKey)
        .then((response) => response.json())
        .then((json) => {
          send("content", "signMessage", {
            message: json.code,
          });
        });
    }
  } else {
    globalState.waitingToConnect = false;
  }

  send("popup", "solanaStatus", globalState);

  return false;
}
