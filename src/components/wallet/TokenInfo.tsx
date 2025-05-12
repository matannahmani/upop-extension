import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import ProgressBar from "../common/ProgressBar";
import { listItem } from "../../utils/animation";
import { useWallet } from "../../contexts/WalletContext";
import Button from "../common/Button";
import { Loader } from "lucide-react";
import { User } from "../../types/user";

interface TokenInfoProps {
  user: User;
  className?: string;
}

export const TokenInfoComponent: React.FC<TokenInfoProps> = ({
  user,
  className,
}) => {
  const { refresh, isRefreshing } = useWallet();
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">Token Supply</h3>

        <div className="space-y-4">
          <motion.div
            variants={listItem}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            <ProgressBar
              value={user.balance}
              max={user.totalSupply * 0.025}
              color="purple"
            />

            <div className="flex items-center justify-between text-xs mt-2">
              <span>You have :</span>
              <span className="text-gray-400">
                {user.balance} $UPOP ({user.percentage.toFixed(2)}% Supply)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Required:</span>
              <span className="text-gray-500">25M $UPOP (0.25% Supply)</span>
            </div>
            <Button
              variant="secondary"
              className="mt-4"
              disabled={isRefreshing}
              onClick={refresh}
              rightIcon={
                isRefreshing ? <Loader className="animate-spin" /> : null
              }
            >
              Refresh
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoComponent;
