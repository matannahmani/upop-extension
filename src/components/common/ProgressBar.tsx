import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "blue" | "purple" | "green" | "red";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "purple",
  size = "md",
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const colorStyles = {
    blue: "bg-blue-500",
    purple: "bg-utop",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{label || "Progress"}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}

      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700",
          sizeStyles[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorStyles[color])}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
