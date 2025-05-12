import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import Input from "../common/Input";
import Button from "../common/Button";
import { Layout } from "@/src/types/layout";

interface EditLayoutProps {
  layout: Layout;
  onSubmit: (id: string, data: { name: string }) => void;
  onCancel: () => void;
  className?: string;
}

export const EditLayout: React.FC<EditLayoutProps> = ({
  layout,
  onSubmit,
  onCancel,
  className,
}) => {
  const [name, setName] = useState(layout.name);

  useEffect(() => {
    setName(layout.name);
  }, [layout]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(layout.id, { name });
    }
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h2 className="text-xl font-bold">Edit Layout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
            Rename this Layout
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-white"
            placeholder="Enter layout name"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button type="submit" variant="primary" fullWidth>
            Save layout
          </Button>

          <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLayout;
