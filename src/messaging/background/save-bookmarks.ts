import { HandlerParams, HandlerResponse } from "../../types/handler";
import { Message } from "../Action";

export default function handler({
  globalState,
  message,
}: HandlerParams & {
  message: Extract<Message, { action: "saveBookmarks" }>;
}): HandlerResponse {
  fetch(process.env.API_URL + "/api/bookmarks", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + globalState.tokenJwt,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookmarks: message.data }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        globalState.user!.config.bookmarks = message.data;
      }
      console.debug(json);
    });

  return false;
}
