import { ExtensionGlobalState } from "../background";
import { Message } from "../messaging/Action";

export type HandlerParams = {
  globalState: ExtensionGlobalState;
  message: Message;
  sendResponse: (response?: any) => void;
};

export type HandlerResponse = boolean;
