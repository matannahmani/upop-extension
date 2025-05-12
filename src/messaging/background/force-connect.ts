import { send } from "../../utils/message";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "forceConnect" }>;
}): HandlerResponse {
  globalState.tokenJwt = message.data.token;
  globalState.user = message.data.user;
  globalState.isPhantomAvailable = true;
  globalState.isWalletConnected = true;
  globalState.publicKey = message.data.user.address;

  send("popup", "solanaStatus", globalState);

  send("popup", "loginStatus", {
    isConnecting: false,
    tokenJwt: globalState.tokenJwt,
    user: globalState.user,
  });

  send("popup", "config", globalState.user.config);

  (chrome.action as any).openPopup();
  return false;
}
