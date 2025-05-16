
import React from "react";
import { StaticPanel, Condition } from "@/types/task-builder";
import { 
  Card, 
  CardContent, 
  CardTitle, 
  CardHeader,
  CardDescription
} from "@/components/ui/card";

interface StaticPanelsProps {
  panels: StaticPanel[];
  profileAnswers: Record<string, any>;
  stepAnswers: Record<string, any>;
}

const StaticPanels: React.FC<StaticPanelsProps> = ({
  panels,
  profileAnswers,
  stepAnswers,
}) => {
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

  if (visiblePanels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visiblePanels.map((panel, index) => (
        <Card 
          key={index} 
          className={getPanelClass(panel.type || 'info')}
        >
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
                  .map((item, itemIndex) => (
                    <li key={itemIndex}>{item.text}</li>
                  ))}
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
