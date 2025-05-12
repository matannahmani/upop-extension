import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import Button from "../common/Button";
import { getIconComponent } from "../../utils/icons";

interface AccessStatusProps {
  walletAddress: string;
  className?: string;
}

export const AccessStatus: React.FC<AccessStatusProps> = ({
  walletAddress,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-medium",
            "bg-red-900",
            className
          )}
        >
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={cn("h-2 w-2 rounded-full mr-2", "bg-red-500")}
          />
          Access Denied
        </motion.div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Wallet Address
          </h3>
          <div className="bg-gray-800 rounded-md p-2 text-sm font-mono text-gray-300 overflow-hidden text-ellipsis">
            {walletAddress}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400 text-center"
        >
          You don't have enough $UPOP tokens to access the platform.
        </motion.p>

        <Button
          variant="primary"
          fullWidth
          className="mt-4"
          rightIcon={getIconComponent("buy", 16)}
        >
          Buy $UPOP
        </Button>
      </div>
    </div>
  );
};

export default AccessStatus;
