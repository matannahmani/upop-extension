import { Layout } from "./layout";

export interface WindowInfo {
  id: number;
  url: string;
  bookmarkId: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface SavedLayout {
  layout: Layout;
  windows: WindowInfo[];
}

export type ActiveTabInfo = {
  id: number | null;
  url: string;
  title: string;
  isValid: boolean;
};
