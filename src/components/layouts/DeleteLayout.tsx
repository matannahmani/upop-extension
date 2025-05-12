import React from "react";
import { cn } from "../../lib/utils";
import Button from "../common/Button";
import { Layout } from "@/src/types/layout";

interface DeleteLayoutProps {
  layout: Layout;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  className?: string;
}

export const DeleteLayout: React.FC<DeleteLayoutProps> = ({
  layout,
  onConfirm,
  onCancel,
  className,
}) => {
  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h2 className="text-xl font-bold">Delete Layout</h2>

      <p className="text-sm text-gray-400">
        Are you sure you want to delete this layout?
      </p>

      <div className="bg-gray-800 rounded-md p-4 flex items-center space-x-3">
        <span className="font-medium">{layout.name}</span>
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          onClick={() => onConfirm(layout.id)}
          variant="danger"
          fullWidth
          className="bg-red-600 hover:bg-red-700"
        >
          Yes, Delete
        </Button>

        <Button onClick={onCancel} variant="ghost" fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteLayout;
