export interface Layout {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayoutFormData {
  name: string;
  bookmarks: string[];
}
