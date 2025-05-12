import { send } from "../../utils/message";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "syncUser" }>;
}): HandlerResponse {
  console.debug("syncing user", message.data);

  if (message.data === null) {
    globalState.user = undefined;
    globalState.tokenJwt = undefined;
  } else {
    globalState.user = message.data;
  }

  send("popup", "loginStatus", {
    isConnecting: false,
    tokenJwt: globalState.tokenJwt,
    user: globalState.user,
  });

  return false;
}
