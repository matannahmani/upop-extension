import { State } from "../contexts/WalletContext";
import { Bookmark } from "../types/bookmark";
import { Layout } from "../types/layout";
import { User, UserConfig } from "../types/user";
import { ActiveTabInfo } from "../types/window";

export type MessageAction =
  | "solanaStatus"
  | "signResult"
  | "connect"
  | "checkStatus"
  | "signMessage"
  | "loginStatus"
  | "currentUrl"
  | "config"
  | "initStatus"
  | "saveBookmarks"
  | "createWindow"
  | "saveLayout"
  | "deleteLayout"
  | "windowStatusUpdate"
  | "currentActiveLayoutStatusUpdate"
  | "openLayout"
  | "closeLayout"
  | "syncUser"
  | "forceConnect";

export type MessageDataMap = {
  signResult: SignResultData;
  loginStatus: LoginStatusData;
  solanaStatus: State;
  currentUrl: ActiveTabInfo;
  config: UserConfig;
  connect: undefined;
  initStatus: undefined;
  deleteLayout: Pick<Layout, "id">;
  saveLayout: Layout;
  saveBookmarks: Bookmark[];
  createWindow: Bookmark;
  signMessage: SignMessageRequest;
  checkStatus: undefined;
  windowStatusUpdate: WindowStatusUpdate;
  currentActiveLayoutStatusUpdate: CurrentActiveLayoutStatusUpdate;
  openLayout: OpenLayoutData;
  closeLayout: undefined;
  syncUser: User | null;
  forceConnect: ForceConnectData;
};

export type MessageTarget = "popup" | "content" | "background";

export type Message = {
  [K in MessageAction]: {
    target: MessageTarget;
    action: K;
    data: MessageDataMap[K] extends undefined ? undefined : MessageDataMap[K];
  } & (MessageDataMap[K] extends undefined ? { data?: any } : {});
}[MessageAction];

export type SignResultData = {
  hash: string;
};

export type LoginStatusData = {
  isConnecting: boolean;
  tokenJwt?: string;
  user?: User;
  error?: string;
};

export type SignMessageRequest = {
  message: string;
};

export type WindowStatusUpdate = {
  bookmarkId: string;
  state: "OPENED" | "CLOSED";
};

export type CurrentActiveLayoutStatusUpdate = {
  layoutId: string | null;
};

export type OpenLayoutData = {
  layoutId: string | null;
};

export type ForceConnectData = {
  token: string;
  user: User;
};
