
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StaticPanelItem } from '@/types/task-builder';
import { InlineEditor } from '../InlineEditor';

interface DraggableStaticPanelItemProps {
  item: StaticPanelItem;
  itemIndex: number;
  panelId: string;
  isExpanded: boolean;
  isAdmin: boolean;
  editMode: boolean;
  isDeletingItem: boolean;
  isCurrentlyEditingText: boolean;
  isCurrentlyEditingExpanded: boolean;
  onToggleExpanded: () => void;
  onStartEditingText: () => void;
  onStartEditingExpanded: () => void;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
  onDeleteItem: () => void;
  onMoveItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  type: string;
  index: number;
}

const ITEM_TYPE = 'STATIC_PANEL_ITEM';

export const DraggableStaticPanelItem: React.FC<DraggableStaticPanelItemProps> = ({
  item,
  itemIndex,
  panelId,
  isExpanded,
  isAdmin,
  editMode,
  isDeletingItem,
  isCurrentlyEditingText,
  isCurrentlyEditingExpanded,
  onToggleExpanded,
  onStartEditingText,
  onStartEditingExpanded,
  onSaveEdit,
  onCancelEdit,
  onDeleteItem,
  onMoveItem
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { type: ITEM_TYPE, index: itemIndex },
    canDrag: isAdmin && editMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== itemIndex) {
        onMoveItem(draggedItem.index, itemIndex);
        draggedItem.index = itemIndex;
      }
    },
  });

  const ref = React.useRef<HTMLLIElement>(null);
  preview(drop(ref));

  if (item.isExpandable && item.expandedContent) {
    return (
      <li 
        ref={ref}
        className={`list-none relative group ${isDragging ? 'opacity-50' : ''}`}
      >
        <Collapsible>
          <CollapsibleTrigger
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded cursor-pointer"
            onClick={onToggleExpanded}
          >
            <div className="flex items-center flex-1">
              {isAdmin && editMode && (
                <div
                  ref={drag}
                  className="cursor-move p-1 hover:bg-gray-200 rounded mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <GripVertical className="h-4 w-4 text-gray-500" />
                </div>
              )}
              
              {isCurrentlyEditingText ? (
                <div className="flex-1 mr-4" onClick={(e) => e.stopPropagation()}>
                  <InlineEditor
                    content={item.text}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                    placeholder="Item text..."
                  />
                </div>
              ) : (
                <span 
                  className={`flex-1 prose max-w-none ${isAdmin && editMode ? "hover:bg-blue-50 p-1 rounded mr-2" : ""}`}
                  onClick={isAdmin && editMode ? (e) => {
                    e.stopPropagation();
                    onStartEditingText();
                  } : undefined}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              )}
            </div>
            
            {!isCurrentlyEditingText && (
              <div className="flex items-center gap-2">
                {isAdmin && editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem();
                    }}
                    disabled={isDeletingItem}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 border-red-200"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </div>
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2 pl-4 border-l-2 border-gray-200 relative group">
            {isCurrentlyEditingExpanded ? (
              <InlineEditor
                content={item.expandedContent || ''}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                className="text-sm text-gray-600"
                placeholder="Expanded content..."
              />
            ) : (
              <div 
                className={`prose max-w-none text-sm text-gray-600 ${isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors" : ""}`}
                dangerouslySetInnerHTML={{ __html: item.expandedContent }}
                onClick={isAdmin && editMode ? onStartEditingExpanded : undefined}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  }

  return (
    <li 
      ref={ref}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      {isCurrentlyEditingText ? (
        <InlineEditor
          content={item.text}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          placeholder="Item text..."
        />
      ) : (
        <div className="flex items-center">
          {isAdmin && editMode && (
            <div
              ref={drag}
              className="cursor-move p-1 hover:bg-gray-200 rounded mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
          )}
          
          <span 
            className={`prose max-w-none flex-1 ${isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-1 rounded" : ""}`}
            dangerouslySetInnerHTML={{ __html: item.text }}
            onClick={isAdmin && editMode ? onStartEditingText : undefined}
          />
          
          {isAdmin && editMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteItem}
              disabled={isDeletingItem}
              className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 border-red-200"
            >
              <Trash2 className="h-3 w-3 text-red-600" />
            </Button>
          )}
        </div>
      )}
    </li>
  );
};
