
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StaticPanel } from '@/types/task-builder';
import { useStaticPanelMutation } from '@/hooks/useStaticPanelMutation';
import EditableListItem from './EditableListItem';

interface EditablePanelProps {
  panel: StaticPanel;
  panelIndex: number;
  taskId: string;
  onSave: () => void;
  onCancel: () => void;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

const EditablePanel: React.FC<EditablePanelProps> = ({
  panel,
  panelIndex,
  taskId,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(panel.title || '');
  const [content, setContent] = useState(panel.content || '');
  const [type, setType] = useState(panel.type || 'info');
  const [items, setItems] = useState(panel.items || []);
  
  const { updateStaticPanel, isUpdating } = useStaticPanelMutation();

  const handleSave = () => {
    updateStaticPanel({
      taskId,
      panelIndex,
      updates: {
        title: title.trim() || undefined,
        content: content.trim() || undefined,
        type: type as 'info' | 'warning' | 'success' | 'error',
        items: items.length > 0 ? items : undefined
      }
    });
    onSave();
  };

  const updateItem = (itemIndex: number, updates: any) => {
    const updatedItems = [...items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };
    setItems(updatedItems);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit Panel</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Panel title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            theme="snow"
            placeholder="Panel content..."
          />
        </div>

        {items.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">List Items</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <EditableListItem
                  key={index}
                  item={item}
                  itemIndex={index}
                  onUpdate={(updates) => updateItem(index, updates)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditablePanel;
