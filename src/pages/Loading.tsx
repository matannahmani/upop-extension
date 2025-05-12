import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function LoadingPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm"
      )}
    >
      <AnimatePresence key={"connect-page"}>
        <motion.div
          key="welcome-container"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              key="logo-container"
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="relative flex items-center justify-center"
            >
              <motion.div
                key="glow-effect"
                animate="animate"
                variants={glowVariants}
                className="absolute top-0 left-0 right-0 bottom-0 -z-10"
              >
                <div className="w-32 h-32 bg-utop/30 blur-xl rounded-full mx-auto" />
              </motion.div>

              <img
                src="icons/logo.png"
                style={{ width: "118px", height: "118px" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Loader2 className={cn("animate-spin text-upop", "h-12 w-12")} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm"
            >
              Loading extension
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
