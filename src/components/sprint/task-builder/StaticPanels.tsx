
import React from "react";
import { StaticPanel, Condition } from "@/types/task-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Evaluate a condition based on current answers
  const evaluateCondition = (condition: Condition): boolean => {
    let sourceValue: any;

    // Get the value we're checking based on the source
    if (condition.source.profileKey) {
      sourceValue = profileAnswers[condition.source.profileKey];
    } else if (condition.source.stepId) {
      sourceValue = stepAnswers[condition.source.stepId];
    } else {
      return false;
    }

    // If sourceValue is undefined/null, return false
    if (sourceValue === undefined || sourceValue === null) {
      return false;
    }

    // Evaluate the condition based on operator
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

  // Filter panels based on their conditions
  const visiblePanels = panels.filter((panel) => {
    if (!panel.conditions || panel.conditions.length === 0) {
      return true;
    }
    return panel.conditions.every((condition) => evaluateCondition(condition));
  });

  if (visiblePanels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visiblePanels.map((panel, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{panel.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {panel.items
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, itemIndex) => (
                  <li key={itemIndex}>{item.text}</li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaticPanels;
