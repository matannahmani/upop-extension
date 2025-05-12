import React from "react";
import { cn } from "../../lib/utils";
import { Bookmark } from "../../types/bookmark";
import Button from "../common/Button";
import { getIconComponent } from "../../utils/icons";

interface DeleteBookmarkProps {
  bookmark: Bookmark;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  className?: string;
}

export const DeleteBookmark: React.FC<DeleteBookmarkProps> = ({
  bookmark,
  onConfirm,
  onCancel,
  className,
}) => {
  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h2 className="text-xl font-bold">Delete Bookmarks</h2>

      <p className="text-sm text-gray-400">
        Are you sure you want to delete this bookmark?
      </p>

      <div className="bg-gray-800 rounded-md p-4 flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700">
          {getIconComponent(bookmark.icon)}
        </div>
        <span className="font-medium">{bookmark.name}</span>
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          onClick={() => onConfirm(bookmark.id)}
          variant="danger"
          fullWidth
          className="bg-red-600 hover:bg-red-700"
        >
          Yes, Delete
        </Button>

        <Button onClick={onCancel} variant="ghost" fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteBookmark;
