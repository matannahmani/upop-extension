import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import Input from "../common/Input";
import Button from "../common/Button";
import { getIconComponent } from "../../utils/icons";

interface SaveLayoutProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  className?: string;
  defaultName?: string;
}

export const SaveLayout: React.FC<SaveLayoutProps> = ({
  onSubmit,
  onCancel,
  className,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <div className="flex items-center space-x-3">
        <motion.div
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {getIconComponent("save", 24, "text-purple-500")}
        </motion.div>
        <h2 className="text-xl font-bold">Save Current Layout</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
            Layout Name
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
          <Button
            type="submit"
            variant="primary"
            fullWidth
            leftIcon={getIconComponent("save", 16)}
          >
            Save Layout
          </Button>

          <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SaveLayout;
