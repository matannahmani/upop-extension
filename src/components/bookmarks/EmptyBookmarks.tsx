import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface EmptyBookmarksProps {
  className?: string;
  message?: string;
}

export const EmptyBookmarks: React.FC<EmptyBookmarksProps> = ({
  className,
  message = "Looks empty...add your first bookmark.",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-2 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="relative"
      >
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 -z-10"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-20 h-28 bg-utop/30 blur-xl rounded-full" />
        </motion.div>

        <motion.div
          className="relative z-10"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            y: [0, -5, 0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <img
            src="icons/bookmarks.png"
            style={{ height: "100px", width: "100px" }}
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-gray-400 text-sm"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default EmptyBookmarks;
