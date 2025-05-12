import React from "react";
import { cn } from "../../lib/utils";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag"> {
  variant?: "primary" | "secondary" | "ghost" | "inverted";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "ghost",
  size = "md",
  className,
  active = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none";

  const variantStyles = {
    primary: "bg-utop text-white hover:bg-purple-700",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    inverted:
      "bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200",
  };

  const sizeStyles = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const activeStyles = active
    ? "ring-2 ring-purple-500 dark:ring-purple-400"
    : "";

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        activeStyles,
        className
      )}
      style={{
        transform: "scale(1)",
        transition: "transform 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
