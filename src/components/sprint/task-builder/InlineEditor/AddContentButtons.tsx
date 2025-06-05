
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, ChevronDown } from "lucide-react";
import { StaticPanel } from "@/types/task-builder";

interface AddContentButtonsProps {
  panel: StaticPanel;
  onAddItem: () => void;
  onAddCollapsibleItem: () => void;
  onAddContent: () => void;
  className?: string;
}

export const AddContentButtons: React.FC<AddContentButtonsProps> = ({
  panel,
  onAddItem,
  onAddCollapsibleItem,
  onAddContent,
  className = ""
}) => {
  return (
    <div className={`flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="text-xs text-blue-600 font-medium mb-2 w-full">Add content:</div>
      
      {panel.items && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            className="h-8 px-3 text-xs bg-white hover:bg-blue-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCollapsibleItem}
            className="h-8 px-3 text-xs bg-white hover:bg-blue-50"
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            Add Collapsible
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAddContent}
        className="h-8 px-3 text-xs bg-white hover:bg-blue-50"
      >
        <FileText className="h-3 w-3 mr-1" />
        Add Content
      </Button>
    </div>
  );
};
