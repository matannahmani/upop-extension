import React from "react";
import { useWallet } from "../contexts/WalletContext";
import ConnectPage from "./Connect";
import DeniedPage from "./Denied";
import HomePage from "./Home";
import LoadingPage from "./Loading";

export default function Router() {
  const { isLoading, isConnected, hasAccess } = useWallet();

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && (
        <>
          {!isConnected && <ConnectPage />}
          {isConnected && (
            <>
              {!hasAccess && <DeniedPage />}
              {hasAccess && <HomePage />}
            </>
          )}
        </>
      )}
    </>
  );
}
