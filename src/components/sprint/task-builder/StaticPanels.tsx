
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
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Bold, Italic, List, Link, Save, X } from "lucide-react";
import { useStaticPanelMutation } from "@/hooks/useStaticPanelMutation";
import { toast } from "sonner";

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
  const [editingPanel, setEditingPanel] = useState<{ panelIndex: number; field: 'title' | 'content' } | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

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

  const startEditing = (panelIndex: number, field: 'title' | 'content', currentValue: string) => {
    setEditingPanel({ panelIndex, field });
    if (field === 'title') {
      setEditingTitle(currentValue);
    } else {
      setEditingContent(currentValue);
    }
  };

  const cancelEditing = () => {
    setEditingPanel(null);
    setEditingTitle("");
    setEditingContent("");
    setSelectedText("");
    setSelectionRange(null);
  };

  const saveEdit = async () => {
    if (!editingPanel || !taskId) return;

    const updates = editingPanel.field === 'title' 
      ? { title: editingTitle }
      : { content: editingContent };

    try {
      updateStaticPanel({
        taskId,
        panelIndex: editingPanel.panelIndex,
        updates
      });
      cancelEditing();
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const handleTextSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      setSelectionRange({
        start: range.startOffset,
        end: range.endOffset
      });
    }
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'list' | 'link') => {
    if (!selectedText || !selectionRange) return;

    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'list':
        formattedText = `<ul><li>${selectedText}</li></ul>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        } else {
          return;
        }
        break;
    }

    const beforeSelection = editingContent.substring(0, selectionRange.start);
    const afterSelection = editingContent.substring(selectionRange.end);
    setEditingContent(beforeSelection + formattedText + afterSelection);
    setSelectedText("");
    setSelectionRange(null);
  };

  return (
    <div className="space-y-4">
      {visiblePanels.map((panel, index) => (
        <Card 
          key={index} 
          className={`${getPanelClass(panel.type || 'info')} ${isAdmin ? 'group' : ''}`}
        >
          {panel.title && (
            <CardHeader>
              {isAdmin && editingPanel?.panelIndex === index && editingPanel?.field === 'title' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white border rounded-lg p-2 shadow-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveEdit()}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="font-semibold text-lg"
                    autoFocus
                  />
                </div>
              ) : (
                <CardTitle 
                  className={isAdmin ? "cursor-pointer hover:bg-gray-50 p-2 rounded" : ""}
                  onClick={isAdmin ? () => startEditing(index, 'title', panel.title || '') : undefined}
                >
                  {panel.title}
                  {isAdmin && (
                    <span className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to edit
                    </span>
                  )}
                </CardTitle>
              )}
            </CardHeader>
          )}
          <CardContent>
            {panel.content && (
              <div className="prose max-w-none">
                {isAdmin && editingPanel?.panelIndex === index && editingPanel?.field === 'content' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-white border rounded-lg p-2 shadow-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('bold')}
                        disabled={!selectedText}
                        className="h-8 w-8 p-0"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('italic')}
                        disabled={!selectedText}
                        className="h-8 w-8 p-0"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('list')}
                        disabled={!selectedText}
                        className="h-8 w-8 p-0"
                        title="List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('link')}
                        disabled={!selectedText}
                        className="h-8 w-8 p-0"
                        title="Link"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                      <div className="mx-2 h-6 w-px bg-gray-200" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveEdit()}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div
                      contentEditable
                      className="min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dangerouslySetInnerHTML={{ __html: editingContent }}
                      onInput={(e) => setEditingContent(e.currentTarget.innerHTML)}
                      onMouseUp={handleTextSelection}
                    />
                  </div>
                ) : (
                  <div 
                    className={isAdmin ? "cursor-pointer hover:bg-gray-50 p-2 rounded" : ""}
                    dangerouslySetInnerHTML={{ __html: panel.content }}
                    onClick={isAdmin ? () => startEditing(index, 'content', panel.content || '') : undefined}
                  />
                )}
                {isAdmin && !editingPanel && (
                  <div className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click content to edit
                  </div>
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
                              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded cursor-pointer"
                              onClick={() => toggleExpanded(panel.id, itemIndex)}
                            >
                              <span>{item.text}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 pl-4 border-l-2 border-gray-200">
                              <div 
                                className="text-sm text-gray-600 [&>p]:mb-4 [&>p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{ __html: item.expandedContent }}
                              />
                            </CollapsibleContent>
                          </Collapsible>
                        </li>
                      );
                    } else {
                      return (
                        <li key={itemIndex}>{item.text}</li>
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
