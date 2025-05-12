import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Bookmark, BookmarkFormData } from "../types/bookmark";
import { send } from "../utils/message";
import { ActiveTabInfo } from "../types/window";
import { Message, WindowStatusUpdate } from "../messaging/Action";

interface BookmarksContextProps {
  bookmarks: Bookmark[];
  addBookmark: (data: BookmarkFormData) => Promise<Bookmark>;
  updateBookmark: (
    id: string,
    data: Partial<BookmarkFormData>
  ) => Promise<Bookmark | null>;
  deleteBookmark: (id: string) => Promise<boolean>;
  getBookmark: (id: string) => Bookmark | undefined;
  currentTabInfo: ActiveTabInfo | null;
  windowsStatus: {
    [key: string]: WindowStatusUpdate["state"];
  };
  updateBookmarks: (bookmarks: Bookmark[]) => Promise<boolean>;
}

const BookmarksContext = createContext<BookmarksContextProps | undefined>(
  undefined
);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTabInfo, setCurrentTabInfo] = useState<ActiveTabInfo | null>(
    null
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [windowsStatus, setWindowsStatus] = useState<{
    [key: string]: WindowStatusUpdate["state"];
  }>({});

  const getBookmark = (id: string) => {
    return bookmarks.find((bookmark) => bookmark.id === id);
  };

  const addBookmark = async (data: BookmarkFormData): Promise<Bookmark> => {
    const now = new Date();
    const newBookmark: Bookmark = {
      id: uuidv4(),
      name: data.name,
      icon: data.icon,
      url: data.url,
      createdAt: now,
      updatedAt: now,
    };

    setBookmarks((prev) => {
      const tmp = [...prev, newBookmark];
      send("background", "saveBookmarks", tmp);
      return tmp;
    });
    return newBookmark;
  };

  const updateBookmark = async (
    id: string,
    data: Partial<BookmarkFormData>
  ): Promise<Bookmark | null> => {
    const bookmarkIndex = bookmarks.findIndex((b) => b.id === id);

    if (bookmarkIndex === -1) {
      return null;
    }

    const updatedBookmark: Bookmark = {
      ...bookmarks[bookmarkIndex],
      ...data,
      updatedAt: new Date(),
    };

    setBookmarks((prev) => {
      const updated = [...prev];
      updated[bookmarkIndex] = updatedBookmark;
      send("background", "saveBookmarks", updated);
      return updated;
    });

    return updatedBookmark;
  };

  const deleteBookmark = async (id: string): Promise<boolean> => {
    if (!bookmarks.some((b) => b.id === id)) {
      return false;
    }

    setBookmarks((prev) => {
      const tmp = prev.filter((b) => b.id !== id);
      send("background", "saveBookmarks", tmp);
      return tmp;
    });
    return true;
  };

  const updateBookmarks = async (bookmarks: Bookmark[]): Promise<boolean> => {
    setBookmarks(bookmarks);
    send("background", "saveBookmarks", bookmarks);
    return true;
  };

  useEffect(() => {
    const messageListener = (message: Message) => {
      if (message.target === "popup") {
        if (message.action == "currentUrl") {
          setCurrentTabInfo(message.data);
        } else if (message.action == "config") {
          if (message.data.bookmarks != undefined)
            setBookmarks(message.data.bookmarks);
        } else if (message.action == "windowStatusUpdate") {
          setWindowsStatus((pre) => {
            pre[message.data.bookmarkId] = message.data.state;
            return pre;
          });
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        getBookmark,
        currentTabInfo,
        windowsStatus,
        updateBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = (): BookmarksContextProps => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
};

export default BookmarksContext;
