import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";

export default function handler(params: HandlerParams): HandlerResponse {
  send("content", "checkStatus");
  return false;
}
