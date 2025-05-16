
import { SprintTaskDefinition, StepNode, Condition, TaskDefinition } from "@/types/task-builder";

export interface TaskSummary {
  title: string;
  description?: string;
  content?: string | null;
  mainQuestion?: string | null;
  requiresUpload: boolean;
  category?: string | null;
  order_index: number;
}

/**
 * Flattens a nested structure of steps into a single array
 */
export const flattenSteps = (steps: StepNode[]): StepNode[] => {
  let result: StepNode[] = [];
  
  for (const step of steps) {
    result.push(step);
    
    if (step.children && step.children.length > 0) {
      result = result.concat(flattenSteps(step.children));
    }
    
    // Also check for steps in onAnswer conditions
    if (step.onAnswer) {
      for (const key in step.onAnswer) {
        if (Array.isArray(step.onAnswer[key])) {
          result = result.concat(flattenSteps(step.onAnswer[key]));
        }
      }
    }
  }
  
  return result;
};

/**
 * Evaluates if a step should be visible based on its conditions
 */
export const evaluateStepVisibility = (
  step: StepNode, 
  profileAnswers: Record<string, any>,
  stepAnswers: Record<string, any>
): boolean => {
  // If no conditions, step is always visible
  if (!step.conditions || step.conditions.length === 0) {
    return true;
  }
  
  // Check all conditions (implicit AND between conditions)
  return step.conditions.every(condition => {
    const { source, operator, value } = condition;
    
    // Get the actual value to compare against
    let actualValue: any;
    
    if (source.profileKey) {
      actualValue = profileAnswers[source.profileKey];
    } else if (source.stepId) {
      actualValue = stepAnswers[source.stepId];
    } else {
      return true; // If no source specified, condition passes
    }
    
    // Compare based on operator
    switch (operator) {
      case 'equals':
        return actualValue === value;
      case 'not_equals':
        return actualValue !== value;
      case 'in':
        return Array.isArray(value) && value.includes(actualValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(actualValue);
      default:
        return true; // Unknown operator
    }
  });
};

/**
 * Extracts the main content from a task definition
 */
export const getMainContent = (taskDef: SprintTaskDefinition): string | null => {
  if (!taskDef.definition || !taskDef.definition.steps) return null;
  
  // Look for a content step
  const contentStep = taskDef.definition.steps.find(step => 
    step.type === 'content' || step.type === 'exercise'
  );
  
  return contentStep?.text || null;
};

/**
 * Extracts the main question from a task definition
 */
export const getMainQuestion = (taskDef: SprintTaskDefinition): string | null => {
  if (!taskDef.definition || !taskDef.definition.steps) return null;
  
  // Look for a question step
  const questionStep = taskDef.definition.steps.find(step => 
    step.type === 'question'
  );
  
  return questionStep?.text || null;
};

/**
 * Checks if a task requires file upload
 */
export const requiresUpload = (taskDef: SprintTaskDefinition): boolean => {
  if (!taskDef.definition || !taskDef.definition.steps) return false;
  
  // Check if any step requires upload
  return taskDef.definition.steps.some(step => 
    step.type === 'upload' || step.type === 'file'
  );
};

/**
 * Generates a concise summary of a task definition
 */
export const generateTaskSummary = (taskDef: SprintTaskDefinition): TaskSummary => {
  if (!taskDef.definition) {
    return {
      title: taskDef.name || "Unnamed Task",
      description: taskDef.description || "",
      requiresUpload: false,
      order_index: 0
    };
  }
  
  const def = taskDef.definition;
  
  return {
    title: def.taskName || taskDef.name || "Unnamed Task",
    description: def.description || taskDef.description || "",
    content: getMainContent(taskDef),
    mainQuestion: getMainQuestion(taskDef),
    requiresUpload: requiresUpload(taskDef),
    category: def.category,
    order_index: def.order_index || 0 // Get order_index from the definition or default to 0
  };
};
