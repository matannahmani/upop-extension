export type IconType =
  | "phantom"
  | "globe"
  | "discord"
  | "telegram"
  | "x"
  | "list"
  | "buy"
  | "lock"
  | "arrow_down"
  | "bookmarks"
  | "open-blank"
  | "delete"
  | "paper"
  | "plus"
  | "save"
  | "solana"
  | "pen"
  | "token-solana";

export interface Bookmark {
  id: string;
  name: string;
  icon: IconType;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  order?: number;
}

export interface BookmarkFormData {
  name: string;
  icon: IconType;
  url: string;
}
