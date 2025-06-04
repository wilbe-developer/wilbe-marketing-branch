
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';

interface EditableListItemProps {
  text: string;
  expandedContent?: string;
  isExpandable?: boolean;
  onSave: (text: string, expandedContent?: string) => void;
  isAdmin: boolean;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

export const EditableListItem: React.FC<EditableListItemProps> = ({
  text,
  expandedContent,
  isExpandable,
  onSave,
  isAdmin
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editExpandedContent, setEditExpandedContent] = useState(expandedContent || '');

  const handleSave = () => {
    onSave(editText, isExpandable ? editExpandedContent : undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setEditExpandedContent(expandedContent || '');
    setIsEditing(false);
  };

  if (!isAdmin) {
    return <span>{text}</span>;
  }

  if (!isEditing) {
    return (
      <div className="group flex items-center gap-2">
        <span>{text}</span>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Item Text</label>
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {isExpandable && (
        <div>
          <label className="text-sm font-medium">Expanded Content</label>
          <ReactQuill
            value={editExpandedContent}
            onChange={setEditExpandedContent}
            modules={quillModules}
            className="bg-white"
          />
        </div>
      )}
      
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Check className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
