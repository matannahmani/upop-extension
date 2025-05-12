import { send } from "../../utils/message";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { SavedLayout, WindowInfo } from "../../types/window";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "saveLayout" }>;
}): HandlerResponse {
  const layout = message.data;

  chrome.windows.getAll({}, (windows) => {
    windows.forEach((window) => {
      if (globalState.managedWindows.has(window.id!)) {
        const windowInfo = globalState.managedWindows.get(window.id!);
        if (windowInfo) {
          windowInfo.position = {
            x: window.left || 0,
            y: window.top || 0,
          };
          windowInfo.size = {
            width: window.width || 800,
            height: window.height || 600,
          };
          globalState.managedWindows.set(window.id!, windowInfo);
        }
      }
    });

    const managedWindows2: WindowInfo[] = Array.from(
      globalState.managedWindows.values()
    );

    const savedLayout: SavedLayout = {
      layout: layout,
      windows: managedWindows2,
    };

    const savedLayouts: SavedLayout[] = globalState.user?.config.layouts || [];
    const existingIndex = savedLayouts.findIndex(
      (l) => l.layout.id === layout.id
    );

    let isNewLayout = false;

    if (existingIndex >= 0) {
      savedLayouts[existingIndex] = savedLayout;
    } else {
      savedLayouts.push(savedLayout);

      isNewLayout = true;
    }

    fetch(process.env.API_URL + "/api/layouts", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + globalState.tokenJwt,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ layouts: savedLayouts }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          globalState.user!.config.layouts = savedLayouts;

          if (isNewLayout) {
            console.debug("Active layout updated");
            globalState.activeLayout = savedLayout;

            send("popup", "currentActiveLayoutStatusUpdate", {
              layoutId: savedLayout.layout.id,
            });
          }
        }
      });
  });

  return false;
}
