
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EditableListItemProps {
  item: {
    text: string;
    order?: number;
    isExpandable?: boolean;
    expandedContent?: string;
  };
  itemIndex: number;
  onUpdate: (updates: any) => void;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

const EditableListItem: React.FC<EditableListItemProps> = ({
  item,
  itemIndex,
  onUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded p-3 space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Item Text</label>
        <Input
          value={item.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="List item text"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`expandable-${itemIndex}`}
          checked={item.isExpandable || false}
          onCheckedChange={(checked) => onUpdate({ isExpandable: checked })}
        />
        <label htmlFor={`expandable-${itemIndex}`} className="text-sm">
          Make expandable
        </label>
      </div>

      {item.isExpandable && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="flex items-center text-sm text-gray-600 hover:text-gray-800">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            Edit expanded content
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ReactQuill
              value={item.expandedContent || ''}
              onChange={(content) => onUpdate({ expandedContent: content })}
              modules={quillModules}
              theme="snow"
              placeholder="Expanded content..."
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default EditableListItem;
