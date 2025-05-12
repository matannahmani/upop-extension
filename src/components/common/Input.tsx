import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onDrag"> {
  icon?: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  icon,
  error,
  className,
  fullWidth = true,
  ...props
}) => {
  return (
    <div className={cn("relative", fullWidth ? "w-full" : "")}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {icon}
        </div>
      )}

      <input
        className={cn(
          "rounded-md border border-gray-300 bg-white px-4 py-2 transition-colors",
          "focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40",
          "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400",
          "dark:focus:border-purple-500 dark:focus:ring-purple-500/40",
          icon ? "pl-10" : "",
          error ? "border-red-500 dark:border-red-500" : "",
          className
        )}
        style={{
          transform: "scale(1)",
          transition: "all 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
