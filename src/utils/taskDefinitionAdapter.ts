
import { StepNode, TaskDefinition, SprintTaskDefinition, ProfileQuestion } from "@/types/task-builder";

/**
 * Finds a step by ID in the steps tree
 */
export function findStepById(steps: StepNode[], id: string): StepNode | null {
  for (const step of steps) {
    if (step.id === id) {
      return step;
    }
    
    if (step.children && step.children.length > 0) {
      const found = findStepById(step.children, id);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Flattens a nested step tree into a single array
 */
export function flattenSteps(steps: StepNode[]): StepNode[] {
  const result: StepNode[] = [];
  
  for (const step of steps) {
    result.push(step);
    
    if (step.children && step.children.length > 0) {
      result.push(...flattenSteps(step.children));
    }
  }
  
  return result;
}

/**
 * Evaluates if a step should be visible based on its conditions
 */
export function evaluateStepVisibility(
  step: StepNode,
  profileAnswers: Record<string, any>,
  stepAnswers: Record<string, any>
): boolean {
  if (!step.conditions || step.conditions.length === 0) {
    return true;
  }
  
  // All conditions must be true for the step to be visible
  return step.conditions.every(condition => {
    const sourceValue = 'profileKey' in condition.source 
      ? profileAnswers[condition.source.profileKey]
      : stepAnswers[condition.source.stepId];
    
    switch (condition.operator) {
      case 'equals':
        return sourceValue === condition.value;
      case 'not_equals':
        return sourceValue !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(sourceValue);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
      default:
        return true;
    }
  });
}

/**
 * Gets the main question text from a task definition
 */
export function getMainQuestion(taskDef: TaskDefinition): string | null {
  if (!taskDef.steps || taskDef.steps.length === 0) {
    return null;
  }
  
  // Find first question step
  const firstQuestion = taskDef.steps.find(step => step.type === 'question');
  return firstQuestion?.text || null;
}

/**
 * Checks if a task requires file upload
 */
export function requiresUpload(taskDef: TaskDefinition): boolean {
  if (!taskDef.steps) return false;
  
  const flattened = flattenSteps(taskDef.steps);
  return flattened.some(step => step.type === 'upload');
}

/**
 * Gets the main content HTML if available
 */
export function getMainContent(taskDef: TaskDefinition): string | null {
  if (!taskDef.steps) return null;
  
  // Find first content step
  const firstContent = taskDef.steps.find(step => step.type === 'content');
  return firstContent?.content || null;
}

/**
 * Generates a summary of the task definition for display purposes
 */
export function generateTaskSummary(taskDef: SprintTaskDefinition): {
  title: string;
  description: string;
  category: string | null;
  requiresUpload: boolean;
  mainQuestion: string | null;
  content: string | null;
} {
  return {
    title: taskDef.name || taskDef.definition?.taskName || "Untitled Task",
    description: taskDef.description || taskDef.definition?.description || "",
    category: taskDef.definition?.category || null,
    requiresUpload: requiresUpload(taskDef.definition),
    mainQuestion: getMainQuestion(taskDef.definition),
    content: getMainContent(taskDef.definition)
  };
}

/**
 * Ensures all IDs in the object and children have valid IDs
 */
export function ensureValidIdsInObject(obj: any): any {
  if (!obj) return obj;
  
  // If this is an array, process each element
  if (Array.isArray(obj)) {
    return obj.map(item => ensureValidIdsInObject(item));
  }
  
  // If not an object, return as is
  if (typeof obj !== 'object') return obj;
  
  // Create a copy to avoid mutating the original
  const newObj = { ...obj };
  
  // Process ID if this object has one
  if (newObj.id === undefined || newObj.id === null || newObj.id === '') {
    newObj.id = generateStableId();
  }
  
  // Process all properties that are objects or arrays
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      newObj[key] = ensureValidIdsInObject(newObj[key]);
    }
  }
  
  return newObj;
}

/**
 * Generate a stable ID that's UUID v4 compatible
 */
export function generateStableId(): string {
  // Simple implementation for generating random IDs
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
