import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Layout, LayoutFormData } from "../types/layout";
import { send } from "../utils/message";
import { Message } from "../messaging/Action";

interface LayoutsContextProps {
  layouts: Layout[];
  updateLayout: (
    id: string,
    data: Partial<LayoutFormData>
  ) => Promise<Layout | null>;
  deleteLayout: (id: string) => Promise<boolean>;
  getLayout: (id: string) => Layout | undefined;
  saveCurrentLayout: (name: string) => Promise<Layout>;
  activeLayout: string | null;
}

const LayoutsContext = createContext<LayoutsContextProps | undefined>(
  undefined
);

export const LayoutsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [activeLayout, setActiveLayout] = useState<string | null>(null);

  const getLayout = (id: string) => {
    return layouts.find((layout) => layout.id === id);
  };

  const updateLayout = async (
    id: string,
    data: Partial<LayoutFormData>
  ): Promise<Layout | null> => {
    const layoutIndex = layouts.findIndex((l) => l.id === id);

    if (layoutIndex === -1) {
      return null;
    }

    const currentLayout = layouts[layoutIndex];

    const updatedLayout: Layout = {
      ...currentLayout,
      name: data.name || currentLayout.name,
      updatedAt: new Date(),
    };

    setLayouts((prev) => {
      const updated = [...prev];
      updated[layoutIndex] = updatedLayout;
      send("background", "saveLayout", updatedLayout);
      return updated;
    });

    return updatedLayout;
  };

  const deleteLayout = async (id: string): Promise<boolean> => {
    if (!layouts.some((l) => l.id === id)) {
      return false;
    }

    send("background", "deleteLayout", {
      id: id,
    });
    setLayouts((prev) => prev.filter((l) => l.id !== id));
    return true;
  };

  const saveCurrentLayout = async (name: string): Promise<Layout> => {
    const now = new Date();

    const newLayout: Layout = {
      id: uuidv4(),
      name,
      createdAt: now,
      updatedAt: now,
    };

    setLayouts((prev) => {
      const tmp = [...prev, newLayout];
      send("background", "saveLayout", newLayout);
      return tmp;
    });

    return newLayout;
  };

  useEffect(() => {
    const messageListener = (message: Message) => {
      if (message.target === "popup") {
        if (message.action == "config") {
          if (message.data.layouts != undefined)
            setLayouts(message.data.layouts.map((m) => m.layout));
        } else if (message.action == "currentActiveLayoutStatusUpdate") {
          setActiveLayout(message.data.layoutId);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <LayoutsContext.Provider
      value={{
        layouts,
        updateLayout,
        deleteLayout,
        getLayout,
        saveCurrentLayout,
        activeLayout,
      }}
    >
      {children}
    </LayoutsContext.Provider>
  );
};

export const useLayouts = (): LayoutsContextProps => {
  const context = useContext(LayoutsContext);
  if (!context) {
    throw new Error("useLayouts must be used within a LayoutsProvider");
  }
  return context;
};

export default LayoutsContext;
