import { Bookmark } from "./bookmark";
import { SavedLayout } from "./window";

export type User = {
  id: string;
  config: UserConfig;
  hasAccess: boolean;
  percentage: number;
  totalSupply: number;
  balance: number;
  address: string;
};

export type UserConfig = {
  bookmarks: Bookmark[];
  layouts: SavedLayout[];
};
