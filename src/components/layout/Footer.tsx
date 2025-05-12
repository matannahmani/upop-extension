import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import IconButton from "../common/IconButton";
import { getIconComponent } from "../../utils/icons";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-center py-3 px-4 border-t border-gray-800",
        "bg-gray-900 shadow-lg z-10",
        className
      )}
    >
      <div className="flex items-center space-x-6">
        <IconButton
          icon={getIconComponent("globe", 20)}
          onClick={() => {
            window.open("https://upop.gg/", "_blank");
          }}
          variant="ghost"
          aria-label="Globe"
        />

        <IconButton
          icon={getIconComponent("paper", 20)}
          onClick={() => {
            window.open("https://upop.gg/", "_blank");
          }}
          variant="ghost"
          aria-label="Document"
        />

        <IconButton
          icon={getIconComponent("x", 20)}
          onClick={() => {
            window.open("https://x.com/getupop", "_blank");
          }}
          variant="ghost"
          aria-label="X"
        />
      </div>
    </motion.footer>
  );
};

export default Footer;
