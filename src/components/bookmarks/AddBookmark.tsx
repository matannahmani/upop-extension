import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { IconType } from "../../types/bookmark";
import Input from "../common/Input";
import Button from "../common/Button";
import IconButton from "../common/IconButton";
import { getIconComponent } from "../../utils/icons";
import { isUrlValid } from "../../utils/string";

interface AddBookmarkProps {
  onSubmit: (data: { name: string; icon: IconType; url: string }) => void;
  onCancel: () => void;
  className?: string;
  defaultName?: string;
  currentUrl?: string;
}

export const iconsList: Array<{ type: IconType; component: JSX.Element }> = [
  { type: "globe", component: getIconComponent("globe") },
  { type: "discord", component: getIconComponent("discord") },
  { type: "telegram", component: getIconComponent("telegram") },
  { type: "x", component: getIconComponent("x") },
];

export const AddBookmark: React.FC<AddBookmarkProps> = ({
  onSubmit,
  onCancel,
  className,
  defaultName = "",
  currentUrl = "",
}) => {
  const [name, setName] = useState(defaultName);
  const [selectedIcon, setSelectedIcon] = useState<IconType>("globe");
  const [url, setUrl] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length > 0 && url.length > 0) {
      if (isUrlValid(url)) {
        onSubmit({ name, icon: selectedIcon, url });
      } else {
        alert("Specified url is not a valid url");
      }
    }
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h2 className="text-xl font-bold">Add to Bookmarks</h2>

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
          <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
            Url
          </label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-white"
            placeholder="Enter bookmark url"
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
                  type="button"
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
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={name.length < 0 || url.length < 0 || !isUrlValid(url)}
          >
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

export default AddBookmark;
