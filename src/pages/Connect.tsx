import React from "react";
import WelcomeScreen from "../components/wallet/WelcomeScreen";
import { useWallet } from "../contexts/WalletContext";
import Layout from "../components/layout/Layout";

export default function ConnectPage() {
  const { connectWallet } = useWallet();

  return (
    <Layout showHeader={false} showFooter={false} centered>
      <WelcomeScreen onConnectPhantom={connectWallet} />
    </Layout>
  );
}
