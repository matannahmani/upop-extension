import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { Bookmark } from "../../types/bookmark";
import BookmarkItem from "./BookmarkItem";
import EmptyBookmarks from "./EmptyBookmarks";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { getIconComponent } from "../../utils/icons";
import { WindowStatusUpdate } from "../../messaging/Action";

const SortableBookmarkItem = ({
  bookmark,
  index,
  onEdit,
  onDelete,
  onOpen,
  state,
}: {
  bookmark: Bookmark;
  index: number;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onOpen: (bookmark: Bookmark) => void;
  state: "OPENED" | "CLOSED";
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center rounded-md",
        isDragging && "shadow-lg bg-gray-800"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center px-1 cursor-grab"
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>
      <div className="flex-grow">
        <BookmarkItem
          bookmark={bookmark}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
          state={state}
        />
      </div>
    </div>
  );
};

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onOpen: (bookmark: Bookmark) => void;
  onAddNew: () => void;
  onReorder: (bookmarks: Bookmark[]) => void;
  className?: string;
  title?: string;
  count?: number;
  collapsible?: boolean;
  windowsStatus: {
    [key: string]: WindowStatusUpdate["state"];
  };
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  bookmarks,
  onEdit,
  onDelete,
  onOpen,
  onAddNew,
  onReorder,
  className,
  title = "Bookmarks",
  count,
  collapsible = true,
  windowsStatus,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayCount = count !== undefined ? count : bookmarks.length;

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedBookmarks = [...sortedBookmarks];

      const oldIndex = updatedBookmarks.findIndex(
        (bookmark) => bookmark.id === active.id
      );
      const newIndex = updatedBookmarks.findIndex(
        (bookmark) => bookmark.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedItem] = updatedBookmarks.splice(oldIndex, 1);
        updatedBookmarks.splice(newIndex, 0, movedItem);

        const reorderedBookmarks = updatedBookmarks.map((bookmark, idx) => ({
          ...bookmark,
          order: idx,
        }));

        onReorder(reorderedBookmarks);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex items-center justify-between py-2",
          collapsible && "cursor-pointer"
        )}
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-2">
          {collapsible && (
            <motion.div
              initial={false}
              animate={{ rotate: isCollapsed ? 0 : 90 }}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </motion.div>
          )}
          <h2 className="text-lg font-semibold">
            {title}{" "}
            <span className="text-sm text-gray-400">({displayCount})</span>
          </h2>
        </div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {sortedBookmarks.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedBookmarks.map((bookmark) => bookmark.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {sortedBookmarks.map((bookmark, index) => (
                      <SortableBookmarkItem
                        key={bookmark.id}
                        bookmark={bookmark}
                        index={index}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onOpen={onOpen}
                        state={
                          windowsStatus[bookmark.id] !== undefined
                            ? windowsStatus[bookmark.id]
                            : "CLOSED"
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <EmptyBookmarks />
            )}
            <motion.div
              className="mt-2 flex items-center justify-center cursor-pointer py-2 rounded-md border border-dashed border-gray-700 hover:border-gray-500 transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={onAddNew}
            >
              {getIconComponent("plus", 16, "mr-1")}
              <span className="text-sm text-gray-400">
                Add a website to bookmarks
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookmarksList;
