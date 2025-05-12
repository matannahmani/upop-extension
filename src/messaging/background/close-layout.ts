import { HandlerParams, HandlerResponse } from "../../types/handler";
import { send } from "../../utils/message";

export default function handler({
  globalState,
}: HandlerParams): HandlerResponse {
  const activeWindows = Array.from(globalState.managedWindows.keys()).map(
    (m) => {
      const d = globalState.managedWindows.get(m);

      return {
        windowId: m,
        bookmarkId: d!.bookmarkId,
      };
    }
  );

  if (globalState.activeLayout) {
    const closePromises = globalState.activeLayout.windows
      .map((w) => activeWindows.find((a) => a.bookmarkId == w.bookmarkId))
      .filter((w) => w != undefined && w != null)
      .map((id) => {
        return new Promise<void>((resolve) => {
          console.log("closing " + id);
          chrome.windows.remove(id.windowId, () => {
            send("popup", "windowStatusUpdate", {
              bookmarkId: id.bookmarkId,
              state: "CLOSED",
            });
            globalState.managedWindows.delete(id.windowId);
            resolve();
          });
        });
      });

    Promise.all(closePromises).then(() => {
      globalState.activeLayout = undefined;
      send("popup", "currentActiveLayoutStatusUpdate", {
        layoutId: null,
      });
    });
  }

  return false;
}
