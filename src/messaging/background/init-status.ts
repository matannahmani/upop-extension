import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";

export default function handler({
  globalState,
}: HandlerParams): HandlerResponse {
  send("popup", "solanaStatus", globalState);
  send("popup", "loginStatus", {
    isConnecting: false,
    tokenJwt: globalState.tokenJwt,
    user: globalState.user,
  });
  send("popup", "currentUrl", globalState.activeTabInfo);

  if (globalState.user) {
    send("popup", "config", globalState.user.config);
  }

  const windowIds = Array.from(globalState.managedWindows.keys());

  windowIds.forEach((id) => {
    send("popup", "windowStatusUpdate", {
      bookmarkId: globalState.managedWindows.get(id)!.bookmarkId,
      state: "OPENED",
    });
  });

  if (globalState.activeLayout) {
    send("popup", "currentActiveLayoutStatusUpdate", {
      layoutId: globalState.activeLayout.layout.id,
    });
  }

  return false;
}
