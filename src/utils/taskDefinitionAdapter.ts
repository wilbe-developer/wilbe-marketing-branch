
import { SprintTaskDefinition } from "@/types/task-builder";

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
