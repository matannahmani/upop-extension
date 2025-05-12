import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import BookmarksList from "../components/bookmarks/BookmarksList";
import LayoutsList from "../components/layouts/LayoutsList";
import AddBookmark from "../components/bookmarks/AddBookmark";
import EditBookmark from "../components/bookmarks/EditBookmark";
import DeleteBookmark from "../components/bookmarks/DeleteBookmark";
import SaveLayout from "../components/layouts/SaveLayout";
import Modal from "../components/common/Modal";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useLayouts } from "../contexts/LayoutsContext";
import { Bookmark } from "../types/bookmark";
import { Layout as LayoutType } from "../types/layout";
import { ExternalLink, Bookmark as BookmarkIcon } from "lucide-react";
import EditLayout from "../components/layouts/EditLayout";
import DeleteLayout from "../components/layouts/DeleteLayout";
import { truncateString } from "../utils/string";
import { send } from "../utils/message";

const HomePage = () => {
  const {
    bookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    currentTabInfo,
    windowsStatus,
    updateBookmarks,
  } = useBookmarks();

  const {
    layouts,
    saveCurrentLayout,
    updateLayout,
    deleteLayout,
    activeLayout,
  } = useLayouts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveLayoutModalOpen, setIsSaveLayoutModalOpen] = useState(false);

  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<LayoutType | null>(null);

  const handleAddBookmark = async (data: {
    name: string;
    icon: any;
    url: string;
  }) => {
    await addBookmark({
      name: data.name,
      icon: data.icon,
      url: data.url,
    });
    setIsAddModalOpen(false);
  };

  const handleEditBookmark = async (
    id: string,
    data: { name: string; icon: any }
  ) => {
    await updateBookmark(id, {
      name: data.name,
      icon: data.icon,
    });
    setIsEditModalOpen(false);
    setSelectedBookmark(null);
  };

  const handleEditLayout = async (id: string, data: { name: string }) => {
    await updateLayout(id, {
      name: data.name,
    });
    setIsEditModalOpen(false);
    setSelectedBookmark(null);
  };

  const handleDeleteBookmark = async (id: string) => {
    await deleteBookmark(id);
    setIsDeleteModalOpen(false);
    setSelectedBookmark(null);
  };

  const handleDeleteLayout = async (id: string) => {
    await deleteLayout(id);
    setIsDeleteModalOpen(false);
    setSelectedLayout(null);
  };

  const handleSaveLayout = async (name: string) => {
    await saveCurrentLayout(name);
    setIsSaveLayoutModalOpen(false);
  };

  const handleOpenBookmark = (bookmark: Bookmark) => {
    send("background", "createWindow", bookmark);
  };

  const handleOpenLayout = (layout: LayoutType) => {
    send("background", "openLayout", {
      layoutId: layout.id,
    });
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Button
            variant="secondary"
            fullWidth
            className="bg-white hover:bg-gray-100 text-gray-800"
            rightIcon={<ExternalLink size={16} />}
            disabled={!bookmarks || bookmarks.length == 0}
            onClick={() => {
              bookmarks.forEach(handleOpenBookmark);
            }}
          >
            Open All Bookmarks
          </Button>

          <Button
            variant="primary"
            fullWidth
            rightIcon={<BookmarkIcon size={16} />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={
              currentTabInfo == null ||
              currentTabInfo.url.startsWith("chrome://") ||
              currentTabInfo.url.startsWith("chrome-extension://") ||
              currentTabInfo.url == ""
            }
          >
            Add to bookmarks
            {currentTabInfo &&
              currentTabInfo.url != "" &&
              !currentTabInfo.url.startsWith("chrome://") &&
              !currentTabInfo.url.startsWith("chrome-extension://") &&
              ` (${truncateString(currentTabInfo.title)})`}
          </Button>
        </div>

        <BookmarksList
          bookmarks={bookmarks}
          onEdit={(bookmark) => {
            setSelectedBookmark(bookmark);
            setIsEditModalOpen(true);
          }}
          onDelete={(bookmark) => {
            setSelectedBookmark(bookmark);
            setIsDeleteModalOpen(true);
          }}
          onOpen={handleOpenBookmark}
          onAddNew={() => setIsAddModalOpen(true)}
          windowsStatus={windowsStatus}
          onReorder={function (bookmarks: Bookmark[]): void {
            updateBookmarks(bookmarks);
          }}
        />

        <LayoutsList
          layouts={layouts}
          onClose={() => {
            send("background", "closeLayout");
          }}
          onEdit={(layout) => {
            setSelectedLayout(layout);
            setIsEditModalOpen(true);
          }}
          onDelete={(layout) => {
            setSelectedLayout(layout);
            setIsDeleteModalOpen(true);
          }}
          onOpen={handleOpenLayout}
          onSaveCurrent={() => setIsSaveLayoutModalOpen(true)}
          activeLayout={activeLayout}
        />
      </div>

      <AnimatePresence>
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          key={"modal-add-bookmark"}
        >
          <AddBookmark
            onSubmit={handleAddBookmark}
            onCancel={() => setIsAddModalOpen(false)}
            currentUrl={
              currentTabInfo != null &&
              !currentTabInfo.url.startsWith("chrome://") &&
              !currentTabInfo.url.startsWith("chrome-extension://")
                ? currentTabInfo.url
                : undefined
            }
            defaultName={
              currentTabInfo != null &&
              !currentTabInfo.url.startsWith("chrome://") &&
              !currentTabInfo.url.startsWith("chrome-extension://")
                ? currentTabInfo.title
                : undefined
            }
          />
        </Modal>

        {selectedBookmark && (
          <Modal
            key={"modal-edit-bookmark"}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedBookmark(null);
            }}
          >
            <EditBookmark
              bookmark={selectedBookmark}
              onSubmit={handleEditBookmark}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedBookmark(null);
              }}
            />
          </Modal>
        )}

        {/* Delete Bookmark Modal */}
        {selectedBookmark && (
          <Modal
            key={"modal-delete-bookmark"}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedBookmark(null);
            }}
          >
            <DeleteBookmark
              bookmark={selectedBookmark}
              onConfirm={handleDeleteBookmark}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setSelectedBookmark(null);
              }}
            />
          </Modal>
        )}

        {selectedLayout && (
          <Modal
            key={"modal-edit-layout"}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedBookmark(null);
            }}
          >
            <EditLayout
              layout={selectedLayout}
              onSubmit={handleEditLayout}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedLayout(null);
              }}
            />
          </Modal>
        )}

        {/* Delete Bookmark Modal */}
        {selectedLayout && (
          <Modal
            key={"modal-delete-layout"}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedBookmark(null);
            }}
          >
            <DeleteLayout
              layout={selectedLayout}
              onConfirm={handleDeleteLayout}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setSelectedLayout(null);
              }}
            />
          </Modal>
        )}

        <Modal
          isOpen={isSaveLayoutModalOpen}
          key={"modal-save-layout"}
          onClose={() => setIsSaveLayoutModalOpen(false)}
        >
          <SaveLayout
            onSubmit={handleSaveLayout}
            onCancel={() => setIsSaveLayoutModalOpen(false)}
          />
        </Modal>
      </AnimatePresence>
    </Layout>
  );
};

export default HomePage;
