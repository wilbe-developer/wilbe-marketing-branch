
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
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import StaticPanelEditor from "@/components/admin/StaticPanelEditor";

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
  const [editingPanelIndex, setEditingPanelIndex] = useState<number | null>(null);

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

    // Get the source value based on the condition source type
    if ('profileKey' in condition.source) {
      sourceValue = profileAnswers[condition.source.profileKey];
    } else if ('stepId' in condition.source) {
      sourceValue = stepAnswers[condition.source.stepId];
    } else {
      return false;
    }

    // If no value found, condition fails
    if (sourceValue === undefined || sourceValue === null) {
      return false;
    }

    // Evaluate condition based on operator
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

  // Get panels that should be visible based on current answers
  const visiblePanels = panels.filter(isPanelVisible);

  // Debug logging - now after visiblePanels is declared
  console.log("StaticPanels Debug:", {
    isAdmin,
    taskId,
    panelsCount: panels.length,
    hasVisiblePanels: visiblePanels.length > 0
  });

  if (visiblePanels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visiblePanels.map((panel, visibleIndex) => {
        // Find the original index in the full panels array
        const originalIndex = panels.findIndex(p => p.id === panel.id);
        
        console.log("Panel Debug:", {
          visibleIndex,
          originalIndex,
          panelId: panel.id,
          isAdmin,
          taskId,
          shouldShowEdit: isAdmin && taskId
        });

        return (
          <Card 
            key={originalIndex} 
            className={`${getPanelClass(panel.type || 'info')} ${isAdmin ? 'relative group' : ''}`}
          >
            {isAdmin && taskId && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-red-500 text-white border-2 border-blue-500 z-10"
                onClick={() => {
                  console.log("Edit button clicked for originalIndex:", originalIndex);
                  setEditingPanelIndex(originalIndex);
                }}
              >
                <Edit className="h-4 w-4" />
                EDIT BUTTON
              </Button>
            )}
            
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
        );
      })}
      
      {isAdmin && taskId && (
        <StaticPanelEditor
          panels={panels}
          taskId={taskId}
          editingPanelIndex={editingPanelIndex}
          onStartEdit={setEditingPanelIndex}
          onStopEdit={() => setEditingPanelIndex(null)}
        />
      )}
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
