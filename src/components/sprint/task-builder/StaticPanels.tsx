import React, { useState } from "react";
import { StaticPanel, Condition } from "@/types/task-builder";
import { 
  Card, 
  CardContent, 
  CardTitle, 
  CardHeader,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Edit, Eye, Trash2 } from "lucide-react";
import { useStaticPanelMutation } from "@/hooks/useStaticPanelMutation";
import { toast } from "sonner";
import { InlineEditor } from "./InlineEditor";
import { useAddContent } from "./InlineEditor/useAddContent";
import { AddContentButtons } from "./InlineEditor/AddContentButtons";
import { DragDropProvider } from "./StaticPanels/DragDropProvider";
import { DraggableStaticPanelItem } from "./StaticPanels/DraggableStaticPanelItem";

interface StaticPanelsProps {
  panels: StaticPanel[];
  profileAnswers: Record<string, any>;
  stepAnswers: Record<string, any>;
  isAdmin?: boolean;
  taskId?: string;
}

const StaticPanels: React.FC<StaticPanelsProps> = ({
  panels,
  profileAnswers,
  stepAnswers,
  isAdmin = false,
  taskId
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editingState, setEditingState] = useState<{
    type: 'panel-title' | 'panel-content' | 'item-text' | 'item-expanded';
    panelId: string;
    itemIndex?: number;
  } | null>(null);

  const { 
    updateStaticPanel, 
    addPanelItem, 
    deletePanelItem, 
    deletePanelContent,
    isUpdating,
    isDeletingItem,
    isDeletingContent
  } = useStaticPanelMutation();
  
  const {
    addingContent,
    startAddingItem,
    startAddingCollapsibleItem,
    startAddingContent,
    cancelAdding,
    createNewItem
  } = useAddContent();

  // Toggle expanded state for dropdown items
  const toggleExpanded = (panelId: string, itemIndex: number) => {
    const itemKey = `${panelId}-${itemIndex}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  // Evaluate a condition based on provided answers
  const evaluateCondition = (condition: Condition): boolean => {
    let sourceValue: any;

    if ('profileKey' in condition.source) {
      sourceValue = profileAnswers[condition.source.profileKey];
    } else if ('stepId' in condition.source) {
      sourceValue = stepAnswers[condition.source.stepId];
    } else {
      return false;
    }

    if (sourceValue === undefined || sourceValue === null) {
      return false;
    }

    switch (condition.operator) {
      case "equals":
        return sourceValue === condition.value;
      case "not_equals":
        return sourceValue !== condition.value;
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(sourceValue);
      case "not_in":
        return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
      default:
        return false;
    }
  };

  // Check if a panel should be visible based on its conditions
  const isPanelVisible = (panel: StaticPanel): boolean => {
    if (!panel.conditions || panel.conditions.length === 0) {
      return true;
    }
    return panel.conditions.every(condition => evaluateCondition(condition));
  };

  const visiblePanels = panels.filter(isPanelVisible);

  if (visiblePanels.length === 0 && (!isAdmin || !editMode)) {
    return null;
  }

  const startEditing = (type: 'panel-title' | 'panel-content' | 'item-text' | 'item-expanded', panelId: string, itemIndex?: number) => {
    setEditingState({ type, panelId, itemIndex });
  };

  const cancelEditing = () => {
    setEditingState(null);
    cancelAdding();
  };

  const saveEdit = async (newContent: string) => {
    if (!editingState || !taskId) return;

    // Find the original panel index in the full panels array
    const originalPanelIndex = panels.findIndex(p => p.id === editingState.panelId);
    if (originalPanelIndex === -1) {
      toast.error("Panel not found");
      return;
    }

    const panel = panels[originalPanelIndex];
    
    try {
      let updates: any = {};

      if (editingState.type === 'panel-title') {
        updates = { title: newContent };
      } else if (editingState.type === 'panel-content') {
        updates = { content: newContent };
      } else if (editingState.type === 'item-text' && editingState.itemIndex !== undefined) {
        const updatedItems = [...(panel.items || [])];
        updatedItems[editingState.itemIndex] = {
          ...updatedItems[editingState.itemIndex],
          text: newContent
        };
        updates = { items: updatedItems };
      } else if (editingState.type === 'item-expanded' && editingState.itemIndex !== undefined) {
        const updatedItems = [...(panel.items || [])];
        updatedItems[editingState.itemIndex] = {
          ...updatedItems[editingState.itemIndex],
          expandedContent: newContent
        };
        updates = { items: updatedItems };
      }

      await updateStaticPanel({
        taskId,
        panelIndex: originalPanelIndex,
        updates
      });
      
      cancelEditing();
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleMoveItem = async (panelId: string, dragIndex: number, hoverIndex: number) => {
    if (!taskId) return;
    
    const originalPanelIndex = panels.findIndex(p => p.id === panelId);
    if (originalPanelIndex === -1) return;

    const panel = panels[originalPanelIndex];
    if (!panel.items) return;

    try {
      const updatedItems = [...panel.items];
      const draggedItem = updatedItems[dragIndex];
      
      // Remove the dragged item and insert it at the new position
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);

      await updateStaticPanel({
        taskId,
        panelIndex: originalPanelIndex,
        updates: { items: updatedItems }
      });
    } catch (error) {
      console.error("Move item error:", error);
      toast.error("Failed to reorder items");
    }
  };

  const handleAddContent = async (panelId: string, type: 'item' | 'collapsible-item' | 'content') => {
    if (!taskId) return;
    
    const originalPanelIndex = panels.findIndex(p => p.id === panelId);
    if (originalPanelIndex === -1) return;

    try {
      if (type === 'item' || type === 'collapsible-item') {
        const newItem = createNewItem(type === 'collapsible-item');
        await addPanelItem({
          taskId,
          panelIndex: originalPanelIndex,
          newItem
        });
        
        // Start editing the new item immediately
        setTimeout(() => {
          const panel = panels[originalPanelIndex];
          const itemIndex = (panel.items?.length || 0);
          startEditing('item-text', panelId, itemIndex);
        }, 100);
      } else if (type === 'content') {
        // Switch panel to content mode
        await updateStaticPanel({
          taskId,
          panelIndex: originalPanelIndex,
          updates: { content: "New content goes here..." }
        });
        
        // Start editing the content immediately  
        setTimeout(() => {
          startEditing('panel-content', panelId);
        }, 100);
      }
      
      cancelAdding();
      toast.success("Content added successfully");
    } catch (error) {
      console.error("Add content error:", error);
      toast.error("Failed to add content");
    }
  };

  const handleDeleteItem = async (panelId: string, itemIndex: number) => {
    if (!taskId || !window.confirm("Are you sure you want to delete this item?")) return;
    
    const originalPanelIndex = panels.findIndex(p => p.id === panelId);
    if (originalPanelIndex === -1) return;

    try {
      await deletePanelItem({
        taskId,
        panelIndex: originalPanelIndex,
        itemIndex
      });
    } catch (error) {
      console.error("Delete item error:", error);
    }
  };

  const handleDeleteContent = async (panelId: string) => {
    if (!taskId || !window.confirm("Are you sure you want to delete this content section?")) return;
    
    const originalPanelIndex = panels.findIndex(p => p.id === panelId);
    if (originalPanelIndex === -1) return;

    try {
      await deletePanelContent({
        taskId,
        panelIndex: originalPanelIndex
      });
    } catch (error) {
      console.error("Delete content error:", error);
    }
  };

  const isCurrentlyEditing = (type: string, panelId: string, itemIndex?: number) => {
    return editingState?.type === type && 
           editingState?.panelId === panelId && 
           editingState?.itemIndex === itemIndex;
  };

  return (
    <DragDropProvider>
      <div className="space-y-4">
        {/* Admin Edit Mode Toggle */}
        {isAdmin && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Edit Mode Active</span>
                  <span className="text-xs text-blue-600">Click content to edit inline • Drag items to reorder</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Viewing as User</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setEditMode(!editMode);
                  cancelEditing(); // Cancel any active editing when toggling mode
                }}
                className="h-8 px-3"
              >
                {editMode ? "Exit Edit" : "Edit Mode"}
              </Button>
            </div>
          </div>
        )}

        {visiblePanels.map((panel) => (
          <Card 
            key={panel.id} 
            className={`${getPanelClass(panel.type || 'info')} ${isAdmin && editMode ? 'ring-1 ring-blue-200' : ''}`}
          >
            {panel.title && (
              <CardHeader>
                {isCurrentlyEditing('panel-title', panel.id) ? (
                  <InlineEditor
                    content={panel.title || ''}
                    onSave={saveEdit}
                    onCancel={cancelEditing}
                    className="text-lg font-semibold"
                    placeholder="Panel title..."
                  />
                ) : (
                  <CardTitle 
                    className={`prose max-w-none ${isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors" : ""}`}
                    onClick={isAdmin && editMode ? () => startEditing('panel-title', panel.id) : undefined}
                    dangerouslySetInnerHTML={{ __html: panel.title }}
                  />
                )}
              </CardHeader>
            )}
            
            <CardContent>
              {panel.content && (
                <div className="mb-4 relative group">
                  {isCurrentlyEditing('panel-content', panel.id) ? (
                    <InlineEditor
                      content={panel.content || ''}
                      onSave={saveEdit}
                      onCancel={cancelEditing}
                      className="prose max-w-none"
                      placeholder="Panel content..."
                    />
                  ) : (
                    <div className="relative">
                      <div 
                        className={`prose max-w-none ${isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors" : ""}`}
                        dangerouslySetInnerHTML={{ __html: panel.content }}
                        onClick={isAdmin && editMode ? () => startEditing('panel-content', panel.id) : undefined}
                      />
                      {isAdmin && editMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContent(panel.id)}
                          disabled={isDeletingContent}
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 border-red-200"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {panel.items && panel.items.length > 0 && (
                <ul className="prose max-w-none list-disc pl-3 md:pl-5 space-y-2">
                  {panel.items.map((item, itemIndex) => {
                    const itemKey = `${panel.id}-${itemIndex}`;
                    const isExpanded = expandedItems.has(itemKey);
                    
                    return (
                      <DraggableStaticPanelItem
                        key={itemIndex}
                        item={item}
                        itemIndex={itemIndex}
                        panelId={panel.id}
                        isExpanded={isExpanded}
                        isAdmin={isAdmin}
                        editMode={editMode}
                        isDeletingItem={isDeletingItem}
                        isCurrentlyEditingText={isCurrentlyEditing('item-text', panel.id, itemIndex)}
                        isCurrentlyEditingExpanded={isCurrentlyEditing('item-expanded', panel.id, itemIndex)}
                        onToggleExpanded={() => toggleExpanded(panel.id, itemIndex)}
                        onStartEditingText={() => startEditing('item-text', panel.id, itemIndex)}
                        onStartEditingExpanded={() => startEditing('item-expanded', panel.id, itemIndex)}
                        onSaveEdit={saveEdit}
                        onCancelEdit={cancelEditing}
                        onDeleteItem={() => handleDeleteItem(panel.id, itemIndex)}
                        onMoveItem={(dragIndex, hoverIndex) => handleMoveItem(panel.id, dragIndex, hoverIndex)}
                      />
                    );
                  })}
                </ul>
              )}

              {/* Add Content Buttons - shown in edit mode */}
              {isAdmin && editMode && !editingState && (
                <AddContentButtons
                  panel={panel}
                  onAddItem={() => handleAddContent(panel.id, 'item')}
                  onAddCollapsibleItem={() => handleAddContent(panel.id, 'collapsible-item')}
                  onAddContent={() => handleAddContent(panel.id, 'content')}
                  className="mt-4"
                />
              )}
            </CardContent>
          </Card>
        ))}

        {/* Show message when no panels exist but admin is in edit mode */}
        {isAdmin && editMode && visiblePanels.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              No static panels
            </h3>
            <p className="text-blue-600 mb-4">
              This task doesn't have any static panels yet
            </p>
          </div>
        )}
      </div>
    </DragDropProvider>
  );
};

// Helper function to get panel class based on type
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

export default StaticPanels;
