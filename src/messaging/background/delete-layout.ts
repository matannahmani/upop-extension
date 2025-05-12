import { send } from "../../utils/message";
import { HandlerParams, HandlerResponse } from "../../types/handler";
import { SavedLayout } from "../../types/window";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "deleteLayout" }>;
}): HandlerResponse {
  const layout = message.data;
  const savedLayouts: SavedLayout[] = globalState.user?.config.layouts || [];
  const updatedLayouts = savedLayouts.filter((l) => l.layout.id !== layout.id);

  if (
    globalState.activeLayout &&
    globalState.activeLayout.layout.id === layout.id
  ) {
    globalState.activeLayout = undefined;

    send("popup", "currentActiveLayoutStatusUpdate", {
      layoutId: null,
    });
  }

  fetch(process.env.API_URL + "/api/layouts", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + globalState.tokenJwt,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ layouts: updatedLayouts }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        globalState.user!.config.layouts = updatedLayouts;
      }
    });

  return false;
}
