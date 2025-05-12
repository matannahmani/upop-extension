import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Layout } from "../../types/layout";
import LayoutItem from "./LayoutItem";
import EmptyLayouts from "./EmptyLayouts";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getIconComponent } from "../../utils/icons";

interface LayoutsListProps {
  layouts: Layout[];
  onEdit: (layout: Layout) => void;
  onDelete: (layout: Layout) => void;
  onOpen: (layout: Layout) => void;
  onClose: (layout: Layout) => void;
  onSaveCurrent: () => void;
  className?: string;
  collapsible?: boolean;
  activeLayout: string | null;
}

export const LayoutsList: React.FC<LayoutsListProps> = ({
  layouts,
  onEdit,
  onDelete,
  onOpen,
  onClose,
  onSaveCurrent,
  className,
  collapsible = true,
  activeLayout,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
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
            Layouts
            <span className="text-sm text-gray-400">({layouts.length})</span>
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
            {layouts.length > 0 ? (
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {layouts
                    .sort((a, b) => {
                      const aActive =
                        activeLayout != null ? activeLayout === a.id : false;
                      const bActive =
                        activeLayout != null ? activeLayout === b.id : false;

                      if (aActive && !bActive) {
                        return -1;
                      } else if (!aActive && bActive) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                    .map((layout, index) => (
                      <LayoutItem
                        key={layout.id}
                        layout={layout}
                        index={index}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onOpen={onOpen}
                        onClose={onClose}
                        isActive={
                          activeLayout != null
                            ? activeLayout === layout.id
                            : false
                        }
                      />
                    ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyLayouts />
            )}

            <motion.div
              className="mt-2 flex items-center justify-center cursor-pointer py-2 rounded-md border border-dashed border-gray-700 hover:border-gray-500 transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={onSaveCurrent}
            >
              {getIconComponent("save", 16, "mr-1")}
              <span className="text-sm text-gray-400">Save Current Layout</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LayoutsList;
