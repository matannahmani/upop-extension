import React from "react";
import { motion } from "framer-motion";
import { cn, detectExtensionMode } from "../../lib/utils";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
  showHeader?: boolean;
  showFooter?: boolean;
  centered?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  headerProps,
  footerProps,
  showHeader = true,
  showFooter = true,
  centered = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-gray-900 text-white",
        detectExtensionMode() == "fullscreen" ? "h-full" : "max-h-[560px]",
        className
      )}
    >
      {showHeader && <Header {...headerProps} />}

      <motion.main
        className={cn(
          "flex-1 overflow-auto",
          centered ? "flex items-center justify-center" : ""
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.main>

      {showFooter && (
        <div className="sticky bottom-0 w-full">
          <Footer {...footerProps} />
        </div>
      )}
    </div>
  );
};

export default Layout;
