import React from "react";
import { createRoot } from "react-dom/client";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { LayoutsProvider } from "./contexts/LayoutsContext";
import { WalletProvider } from "./contexts/WalletContext";
import "./styles/globals.css";
import Router from "./pages/Router";

export const Popup = () => {
  const port = chrome.runtime.connect({ name: "popup" });
  port.postMessage({ action: "popupOpened" });

  return (
    <WalletProvider>
      <BookmarksProvider>
        <LayoutsProvider>
          <Router />
        </LayoutsProvider>
      </BookmarksProvider>
    </WalletProvider>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
