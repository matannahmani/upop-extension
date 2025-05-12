import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface HeaderProps {
  className?: string;
  logoElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  logoElement,
  rightElement,
}) => {
  const logoDefault = (
    <img src="icons/logo.png" style={{ width: "38px", height: "38px" }} />
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-center justify-between px-4 py-3", className)}
    >
      <div className="flex items-center">{logoElement || logoDefault}</div>

      <div className="flex items-center">{rightElement}</div>
    </motion.header>
  );
};

export default Header;
