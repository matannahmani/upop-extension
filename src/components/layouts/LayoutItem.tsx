import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Layout } from "../../types/layout";
import IconButton from "../common/IconButton";
import { listItem } from "../../utils/animation";
import { getIconComponent } from "../../utils/icons";
import Badge from "../common/Badge";
import Button from "../common/Button";

interface LayoutItemProps {
  layout: Layout;
  index: number;
  onEdit: (layout: Layout) => void;
  onDelete: (layout: Layout) => void;
  onOpen: (layout: Layout) => void;
  onClose: (layout: Layout) => void;
  className?: string;
  isActive: boolean;
}

export const LayoutItem: React.FC<LayoutItemProps> = ({
  layout,
  index,
  onEdit,
  onDelete,
  onOpen,
  onClose,
  className,
  isActive,
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
      onClick={() => onOpen(layout)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-14 h-8 rounded-md bg-gray-800">
          {!isActive && <Badge variant="error" className="mr-2" />}
          {isActive && <Badge variant="success" pulse className="mr-2" />}
          {getIconComponent("list", 18)}
        </div>
        <span className="font-medium text-sm">{layout.name}</span>
      </div>

      <div className="flex items-center space-x-1">
        {isActive && (
          <Button
            onClick={(e) => {
              onClose(layout);
              e.preventDefault();
              e.stopPropagation();
            }}
            variant="ghost"
          >
            Close
          </Button>
        )}

        {!isActive && (
          <IconButton
            icon={getIconComponent("open-blank", 16)}
            onClick={(e) => {
              onOpen(layout);
              e.preventDefault();
              e.stopPropagation();
            }}
            size="sm"
            aria-label="Open"
          />
        )}

        <IconButton
          icon={getIconComponent("pen", 16)}
          onClick={(e) => {
            onEdit(layout);
            e.preventDefault();
            e.stopPropagation();
          }}
          size="sm"
          aria-label="Edit"
        />

        <IconButton
          icon={getIconComponent("delete", 16)}
          onClick={(e) => {
            onDelete(layout);
            e.preventDefault();
            e.stopPropagation();
          }}
          size="sm"
          aria-label="Delete"
        />
      </div>
    </motion.div>
  );
};

export default LayoutItem;
