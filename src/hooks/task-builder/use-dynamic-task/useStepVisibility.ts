
import { useCallback } from "react";
import { StepNode, Condition } from "@/types/task-builder";

export const useStepVisibility = (sprintProfile: any, answers: Record<string, any>) => {
  // Evaluate a single condition against the current state
  const evaluateCondition = useCallback((condition: Condition): boolean => {
    let sourceValue: any;

    // Get the value we're checking against
    if (condition.source.profileKey) {
      sourceValue = sprintProfile?.[condition.source.profileKey];
    } else if (condition.source.stepId) {
      sourceValue = answers[condition.source.stepId];
      
      // Handle nested values when fieldId is specified (e.g., { value: true })
      if (condition.source.fieldId && sourceValue && typeof sourceValue === 'object') {
        sourceValue = sourceValue[condition.source.fieldId];
      }
      
      // Special handling for conditionalQuestion answers which are often in { value: X } format
      if (!condition.source.fieldId && sourceValue && typeof sourceValue === 'object' && 'value' in sourceValue) {
        sourceValue = sourceValue.value;
      }
    } else {
      return false;
    }

    // Evaluate the condition based on the operator
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
  }, [sprintProfile, answers]);

  // Check if a step should be visible based on its conditions
  const isStepVisible = useCallback((step: StepNode): boolean => {
    if (!step.conditions || step.conditions.length === 0) {
      return true;
    }

    // If any condition evaluates to false, the step is not visible
    return step.conditions.every(condition => evaluateCondition(condition));
  }, [evaluateCondition]);

  // Walk the tree and collect visible steps
  const buildVisibleStepsList = useCallback((steps: StepNode[]): StepNode[] => {
    if (!steps) return [];

    const walkTree = (nodes: StepNode[]): StepNode[] => {
      const result: StepNode[] = [];
      
      for (const node of nodes) {
        if (isStepVisible(node)) {
          result.push(node);
          
          // Check if we need to look at children based on answers
          const answer = answers[node.id];
          
          if (node.onAnswer && answer && node.onAnswer[answer]) {
            // Add conditional children based on specific answer
            result.push(...walkTree(node.onAnswer[answer]));
          }
          
          if (node.children) {
            // Add regular children
            result.push(...walkTree(node.children));
          }
        }
      }
      
      return result;
    };
    
    return walkTree(steps);
  }, [isStepVisible, answers]);

  return {
    evaluateCondition,
    isStepVisible,
    buildVisibleStepsList
  };
};
