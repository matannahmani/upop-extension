import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";

export default function handler({
  globalState,
}: HandlerParams): HandlerResponse {
  globalState.waitingToConnect = true;
  send("content", "connect");
  return false;
}
