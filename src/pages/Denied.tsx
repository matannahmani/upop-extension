import { motion } from "framer-motion";
import React from "react";
import AccessStatus from "../components/wallet/AccessStatus";
import TokenInfoComponent from "../components/wallet/TokenInfo";
import { fadeIn } from "../utils/animation";
import { useWallet } from "../contexts/WalletContext";
import Layout from "../components/layout/Layout";

export default function DeniedPage() {
  const {
    publicKey,
    user,
  } = useWallet();

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <AccessStatus walletAddress={publicKey || ""} />
          {user && <TokenInfoComponent user={user} />}
        </motion.div>
      </div>
    </Layout>
  );
}
