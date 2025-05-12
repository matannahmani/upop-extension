import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import Button from "../common/Button";
import { getIconComponent } from "../../utils/icons";
import { useWallet } from "../../contexts/WalletContext";
import { Loader } from "lucide-react";

interface WelcomeScreenProps {
  onConnectPhantom: () => void;
  className?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onConnectPhantom,
  className,
}) => {
  const { isConnecting } = useWallet();

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

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.5 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.7 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.9 },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[70vh] p-6",
        className
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
              style={{ width: "128px", height: "128px" }}
            />
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              key="title"
              initial="hidden"
              animate="visible"
              variants={titleVariants}
              className="text-3xl font-bold text-white akira-font"
            >
              WELCOME TO UPOP
            </motion.h1>

            <motion.p
              key="description"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-gray-400"
              style={{ fontSize: "20px" }}
            >
              Please connect your wallet to access UPOP Features
            </motion.p>
          </div>

          <motion.div
            key="button-container"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button
              onClick={onConnectPhantom}
              variant="primary"
              size="lg"
              className="min-w-[200px]"
              rightIcon={
                isConnecting ? (
                  <Loader className="animate-spin" />
                ) : (
                  getIconComponent("phantom", 18)
                )
              }
              disabled={isConnecting}
            >
              Log In with Phantom
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;
