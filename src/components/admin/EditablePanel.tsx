
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Check, X, Plus, Trash } from 'lucide-react';
import { StaticPanel, StaticPanelItem } from '@/types/task-builder';
import { EditableListItem } from './EditableListItem';

interface EditablePanelProps {
  panel: StaticPanel;
  onSave: (updatedPanel: StaticPanel) => void;
  isAdmin: boolean;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

function getPanelClass(type: 'info' | 'warning' | 'success' | 'error'): string {
  switch (type) {
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200';
  }
}

export const EditablePanel: React.FC<EditablePanelProps> = ({
  panel,
  onSave,
  isAdmin
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPanel, setEditPanel] = useState<StaticPanel>(panel);

  const handleSave = () => {
    onSave(editPanel);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditPanel(panel);
    setIsEditing(false);
  };

  const addNewItem = () => {
    const newItem: StaticPanelItem = {
      text: "New item",
      order: (editPanel.items?.length || 0) + 1,
      isExpandable: false
    };
    setEditPanel({
      ...editPanel,
      items: [...(editPanel.items || []), newItem]
    });
  };

  const updateItem = (index: number, text: string, expandedContent?: string) => {
    const updatedItems = editPanel.items?.map((item, i) => 
      i === index 
        ? { ...item, text, expandedContent }
        : item
    ) || [];
    setEditPanel({ ...editPanel, items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = editPanel.items?.filter((_, i) => i !== index) || [];
    setEditPanel({ ...editPanel, items: updatedItems });
  };

  if (!isAdmin) {
    return (
      <Card className={getPanelClass(panel.type || 'info')}>
        {panel.title && (
          <CardHeader>
            <CardTitle>{panel.title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {panel.content && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: panel.content }} />
            </div>
          )}
          {panel.items && panel.items.length > 0 && (
            <ul className="list-disc pl-5 space-y-2">
              {panel.items
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <li key={index}>
                    {item.text}
                    {item.expandedContent && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <div 
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: item.expandedContent }}
                        />
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!isEditing) {
    return (
      <Card className={`${getPanelClass(panel.type || 'info')} group relative`}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        {panel.title && (
          <CardHeader>
            <CardTitle>{panel.title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {panel.content && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: panel.content }} />
            </div>
          )}
          {panel.items && panel.items.length > 0 && (
            <ul className="list-disc pl-5 space-y-2">
              {panel.items
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <li key={index}>
                    <EditableListItem
                      text={item.text}
                      expandedContent={item.expandedContent}
                      isExpandable={item.isExpandable}
                      onSave={(text, expandedContent) => updateItem(index, text, expandedContent)}
                      isAdmin={false} // Items are edited through the panel editor
                    />
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={getPanelClass(editPanel.type || 'info')}>
      <CardHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Panel Title</label>
            <input
              type="text"
              value={editPanel.title || ''}
              onChange={(e) => setEditPanel({ ...editPanel, title: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Panel title (optional)"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Panel Type</label>
            <select
              value={editPanel.type || 'info'}
              onChange={(e) => setEditPanel({ ...editPanel, type: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Content</label>
          <ReactQuill
            value={editPanel.content || ''}
            onChange={(content) => setEditPanel({ ...editPanel, content })}
            modules={quillModules}
            className="bg-white"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">List Items</label>
            <Button size="sm" variant="outline" onClick={addNewItem}>
              <Plus className="h-3 w-3 mr-1" />
              Add Item
            </Button>
          </div>
          
          {editPanel.items && editPanel.items.length > 0 && (
            <div className="space-y-3">
              {editPanel.items.map((item, index) => (
                <div key={index} className="border p-3 rounded">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateItem(index, e.target.value, item.expandedContent)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Item text"
                      />
                      
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={item.isExpandable || false}
                            onChange={(e) => {
                              const updatedItems = editPanel.items?.map((itm, i) => 
                                i === index 
                                  ? { ...itm, isExpandable: e.target.checked }
                                  : itm
                              ) || [];
                              setEditPanel({ ...editPanel, items: updatedItems });
                            }}
                          />
                          Expandable
                        </label>
                      </div>
                      
                      {item.isExpandable && (
                        <div>
                          <label className="text-xs text-gray-600">Expanded Content</label>
                          <ReactQuill
                            value={item.expandedContent || ''}
                            onChange={(content) => updateItem(index, item.text, content)}
                            modules={quillModules}
                            className="bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(index)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save Panel
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
