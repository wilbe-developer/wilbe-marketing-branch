
import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
import { ChevronDown, ChevronUp, Save, X, Edit, Eye } from "lucide-react";
import { useStaticPanelMutation } from "@/hooks/useStaticPanelMutation";
import { toast } from "sonner";

interface StaticPanelsProps {
  panels: StaticPanel[];
  profileAnswers: Record<string, any>;
  stepAnswers: Record<string, any>;
  isAdmin?: boolean;
  taskId?: string;
}

// Quill toolbar configuration
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

const quillFormats = [
  'bold', 'italic', 'underline', 'list', 'bullet', 'link'
];

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
  const [editingValue, setEditingValue] = useState("");

  const { updateStaticPanel, isUpdating } = useStaticPanelMutation();

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

  if (visiblePanels.length === 0) {
    return null;
  }

  const startEditing = (type: 'panel-title' | 'panel-content' | 'item-text' | 'item-expanded', panelId: string, currentValue: string, itemIndex?: number) => {
    setEditingState({ type, panelId, itemIndex });
    setEditingValue(currentValue || '');
  };

  const cancelEditing = () => {
    setEditingState(null);
    setEditingValue("");
  };

  const saveEdit = async () => {
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
        updates = { title: editingValue };
      } else if (editingState.type === 'panel-content') {
        updates = { content: editingValue };
      } else if (editingState.type === 'item-text' && editingState.itemIndex !== undefined) {
        const updatedItems = [...(panel.items || [])];
        updatedItems[editingState.itemIndex] = {
          ...updatedItems[editingState.itemIndex],
          text: editingValue
        };
        updates = { items: updatedItems };
      } else if (editingState.type === 'item-expanded' && editingState.itemIndex !== undefined) {
        const updatedItems = [...(panel.items || [])];
        updatedItems[editingState.itemIndex] = {
          ...updatedItems[editingState.itemIndex],
          expandedContent: editingValue
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

  const isCurrentlyEditing = (type: string, panelId: string, itemIndex?: number) => {
    return editingState?.type === type && 
           editingState?.panelId === panelId && 
           editingState?.itemIndex === itemIndex;
  };

  const renderEditControls = () => (
    <div className="flex items-center gap-2 bg-white border rounded-lg p-2 shadow-lg mb-2 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={saveEdit}
        disabled={isUpdating}
        className="h-8 px-3"
      >
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={cancelEditing}
        className="h-8 px-3"
      >
        <X className="h-4 w-4 mr-1" />
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Admin Edit Mode Toggle */}
      {isAdmin && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Edit Mode Active</span>
                <span className="text-xs text-blue-600">Click content to edit, chevron to expand</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Viewing as User</span>
              </>
            )}
          </div>
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
      )}

      {visiblePanels.map((panel) => (
        <Card 
          key={panel.id} 
          className={`${getPanelClass(panel.type || 'info')} ${isAdmin && editMode ? 'ring-1 ring-blue-200' : ''}`}
        >
          {panel.title && (
            <CardHeader>
              {isCurrentlyEditing('panel-title', panel.id) ? (
                <div className="space-y-2">
                  {renderEditControls()}
                  <ReactQuill
                    value={editingValue}
                    onChange={setEditingValue}
                    modules={quillModules}
                    formats={quillFormats}
                    theme="snow"
                    className="bg-white rounded border"
                    placeholder="Panel title..."
                  />
                </div>
              ) : (
                <CardTitle 
                  className={isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors border-2 border-dashed border-transparent hover:border-blue-200" : ""}
                  onClick={isAdmin && editMode ? () => startEditing('panel-title', panel.id, panel.title || '') : undefined}
                >
                  <div dangerouslySetInnerHTML={{ __html: panel.title }} />
                </CardTitle>
              )}
            </CardHeader>
          )}
          
          <CardContent>
            {panel.content && (
              <div className="prose max-w-none mb-4">
                {isCurrentlyEditing('panel-content', panel.id) ? (
                  <div className="space-y-2">
                    {renderEditControls()}
                    <ReactQuill
                      value={editingValue}
                      onChange={setEditingValue}
                      modules={quillModules}
                      formats={quillFormats}
                      theme="snow"
                      className="bg-white rounded border min-h-[150px]"
                      placeholder="Panel content..."
                    />
                  </div>
                ) : (
                  <div 
                    className={isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors border-2 border-dashed border-transparent hover:border-blue-200" : ""}
                    dangerouslySetInnerHTML={{ __html: panel.content }}
                    onClick={isAdmin && editMode ? () => startEditing('panel-content', panel.id, panel.content || '') : undefined}
                  />
                )}
              </div>
            )}
            
            {panel.items && panel.items.length > 0 && (
              <ul className="list-disc pl-5 space-y-2">
                {panel.items
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((item, itemIndex) => {
                    const itemKey = `${panel.id}-${itemIndex}`;
                    const isExpanded = expandedItems.has(itemKey);
                    
                    if (item.isExpandable && item.expandedContent) {
                      return (
                        <li key={itemIndex} className="list-none">
                          <Collapsible>
                            <CollapsibleTrigger
                              className={`flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded cursor-pointer ${
                                isAdmin && editMode ? 'border-2 border-dashed border-transparent hover:border-blue-200' : ''
                              }`}
                              onClick={() => toggleExpanded(panel.id, itemIndex)}
                            >
                              {isCurrentlyEditing('item-text', panel.id, itemIndex) ? (
                                <div className="flex-1 mr-4" onClick={(e) => e.stopPropagation()}>
                                  {renderEditControls()}
                                  <ReactQuill
                                    value={editingValue}
                                    onChange={setEditingValue}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    theme="snow"
                                    className="bg-white rounded border"
                                    placeholder="Item text..."
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center flex-1">
                                  <span 
                                    className={`flex-1 ${isAdmin && editMode ? "hover:bg-blue-50 p-1 rounded mr-2 border border-dashed border-transparent hover:border-blue-300" : ""}`}
                                    onClick={isAdmin && editMode ? (e) => {
                                      e.stopPropagation();
                                      startEditing('item-text', panel.id, item.text, itemIndex);
                                    } : undefined}
                                    dangerouslySetInnerHTML={{ __html: item.text }}
                                  />
                                  {isAdmin && editMode && (
                                    <span className="text-xs text-blue-500 mr-2 opacity-70">
                                      Click text to edit →
                                    </span>
                                  )}
                                </div>
                              )}
                              {!isCurrentlyEditing('item-text', panel.id, itemIndex) && (
                                <div className={`flex items-center ${isAdmin && editMode ? 'bg-gray-100 p-1 rounded border border-gray-300' : ''}`}>
                                  {isAdmin && editMode && (
                                    <span className="text-xs text-gray-500 mr-1">
                                      Expand
                                    </span>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                  )}
                                </div>
                              )}
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="mt-2 pl-4 border-l-2 border-gray-200">
                              {isCurrentlyEditing('item-expanded', panel.id, itemIndex) ? (
                                <div className="space-y-2">
                                  {renderEditControls()}
                                  <ReactQuill
                                    value={editingValue}
                                    onChange={setEditingValue}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    theme="snow"
                                    className="bg-white rounded border min-h-[100px]"
                                    placeholder="Expanded content..."
                                  />
                                </div>
                              ) : (
                                <div 
                                  className={`text-sm text-gray-600 [&>p]:mb-4 [&>p:last-child]:mb-0 ${
                                    isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors border-2 border-dashed border-transparent hover:border-blue-200" : ""
                                  }`}
                                  dangerouslySetInnerHTML={{ __html: item.expandedContent }}
                                  onClick={isAdmin && editMode ? () => startEditing('item-expanded', panel.id, item.expandedContent || '', itemIndex) : undefined}
                                />
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        </li>
                      );
                    } else {
                      return (
                        <li key={itemIndex}>
                          {isCurrentlyEditing('item-text', panel.id, itemIndex) ? (
                            <div className="space-y-2">
                              {renderEditControls()}
                              <ReactQuill
                                value={editingValue}
                                onChange={setEditingValue}
                                modules={quillModules}
                                formats={quillFormats}
                                theme="snow"
                                className="bg-white rounded border"
                                placeholder="Item text..."
                              />
                            </div>
                          ) : (
                            <span 
                              className={isAdmin && editMode ? "cursor-pointer hover:bg-blue-50 p-1 rounded border-2 border-dashed border-transparent hover:border-blue-200" : ""}
                              dangerouslySetInnerHTML={{ __html: item.text }}
                              onClick={isAdmin && editMode ? () => startEditing('item-text', panel.id, item.text, itemIndex) : undefined}
                            />
                          )}
                        </li>
                      );
                    }
                  })}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
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
