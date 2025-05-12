import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Bookmark, IconType } from "../../types/bookmark";
import Input from "../common/Input";
import Button from "../common/Button";
import IconButton from "../common/IconButton";
import { iconsList } from "./AddBookmark";

interface EditBookmarkProps {
  bookmark: Bookmark;
  onSubmit: (id: string, data: { name: string; icon: IconType }) => void;
  onCancel: () => void;
  className?: string;
}

export const EditBookmark: React.FC<EditBookmarkProps> = ({
  bookmark,
  onSubmit,
  onCancel,
  className,
}) => {
  const [name, setName] = useState(bookmark.name);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(bookmark.icon);

  useEffect(() => {
    setName(bookmark.name);
    setSelectedIcon(bookmark.icon);
  }, [bookmark]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(bookmark.id, { name, icon: selectedIcon });
    }
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h2 className="text-xl font-bold">Edit Bookmarks</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-white"
            placeholder="Enter bookmark name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Choose an icon
          </label>
          <div className="grid grid-cols-4 gap-2">
            {iconsList.map((icon) => (
              <motion.div
                key={icon.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  icon={icon.component}
                  onClick={() => setSelectedIcon(icon.type)}
                  active={selectedIcon === icon.type}
                  variant={selectedIcon === icon.type ? "primary" : "secondary"}
                  className={cn(
                    "w-full h-12",
                    selectedIcon === icon.type && "bg-utop"
                  )}
                  aria-label={`Select ${icon.type} icon`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button type="submit" variant="primary" fullWidth>
            Save to bookmarks
          </Button>

          <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBookmark;
