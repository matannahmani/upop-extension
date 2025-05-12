import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type BadgeVariant = "success" | "error";

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  variant,
  className,
  size = "md",
  pulse = false,
}) => {
  const variantClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (variant === "success") {
    return (
      <motion.span
        className={cn(
          "inline-block rounded-full",
          variantClasses.success,
          sizeClasses[size],
          className
        )}
        initial={{ scale: 0.8, opacity: 0.7 }}
        animate={{
          scale: [0.8, 1.2, 1],
          opacity: [0.7, 1, 0.9],
          boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0)",
            "0 0 0 4px rgba(34, 197, 94, 0.3)",
            "0 0 0 2px rgba(34, 197, 94, 0.2)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-block rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        pulse && "animate-pulse",
        className
      )}
    />
  );
};

export default Badge;
