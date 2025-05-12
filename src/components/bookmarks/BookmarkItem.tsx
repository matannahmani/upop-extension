import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Bookmark } from "../../types/bookmark";
import IconButton from "../common/IconButton";
import { listItem } from "../../utils/animation";
import { getIconComponent } from "../../utils/icons";
import { WindowStatusUpdate } from "../../messaging/Action";
import { truncateString } from "../../utils/string";
import Badge from "../common/Badge";

interface BookmarkItemProps {
  bookmark: Bookmark;
  index: number;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onOpen: (bookmark: Bookmark) => void;
  className?: string;
  state: WindowStatusUpdate["state"];
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  index,
  onEdit,
  onDelete,
  onOpen,
  className,
  state,
}) => {
  return (
    <motion.div
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className={cn(
        "flex items-center justify-between p-3 rounded-md",
        "hover:bg-gray-800/50 transition-colors",
        className
      )}
      onClick={() => onOpen(bookmark)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-14 h-8 rounded-md bg-gray-800">
          {state == "CLOSED" && <Badge variant="error" className="mr-2" />}
          {state == "OPENED" && (
            <Badge variant="success" pulse className="mr-2" />
          )}
          {getIconComponent(bookmark.icon)}
        </div>
        <span className="font-medium text-sm">
          {truncateString(bookmark.name, 20)}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        {state == "CLOSED" && (
          <IconButton
            icon={getIconComponent("open-blank", 16)}
            onClick={(e) => {
              onOpen(bookmark)
              e.preventDefault()
              e.stopPropagation();
            }}
            size="sm"
            aria-label="Open"
          />
        )}

        <IconButton
          icon={getIconComponent("pen", 16)}
          onClick={(e) => {
            onEdit(bookmark)
            e.preventDefault()
            e.stopPropagation();
          }}
          size="sm"
          aria-label="Edit"
        />

        <IconButton
          icon={getIconComponent("delete", 16)}
          onClick={(e) => {
            onDelete(bookmark)
            e.preventDefault()
            e.stopPropagation();
          }}
          size="sm"
          aria-label="Delete"
        />
      </div>
    </motion.div>
  );
};

export default BookmarkItem;
