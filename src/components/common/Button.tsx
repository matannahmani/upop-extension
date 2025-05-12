import React from "react";
import { cn } from "../../lib/utils";
import { getIconComponent } from "../../utils/icons";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  withLock?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  leftIcon,
  rightIcon,
  isLoading = false,
  withLock = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors";

  const variantStyles = {
    primary:
      "bg-utop text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
    secondary:
      "bg-white text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50",
    danger:
      "bg-utop-red text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const isDisabled = isLoading || disabled;

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-60 cursor-not-allowed" : "",
        className
      )}
      disabled={isDisabled}
      style={{
        transform: isDisabled ? undefined : "scale(1)",
        transition: "transform 0.2s",
      }}
      onMouseOver={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "scale(0.98)";
        }
      }}
      onMouseOut={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {rightIcon && !withLock && <span className="ml-2">{rightIcon}</span>}
      {withLock && <span className="ml-2">{getIconComponent("lock", 16)}</span>}
    </button>
  );
};

export default Button;
