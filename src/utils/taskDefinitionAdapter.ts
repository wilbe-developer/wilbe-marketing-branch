import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { getTaskWorkload } from "./workloadCalculation";

export interface TaskSummary {
  title: string;
  description?: string;
  content?: string;
  requiresUpload: boolean;
  mainQuestion?: string;
  category?: string;
  order_index?: number;
}

export const generateTaskSummary = (task: SprintTaskDefinition): TaskSummary => {
  const definition = task.definition;
  
  return {
    title: definition.taskName || task.name,
    description: definition.description,
    content: getMainContent(definition),
    requiresUpload: requiresUpload(definition),
    mainQuestion: getMainQuestion(definition),
    category: definition.category,
    order_index: definition.order_index
  };
};

export const requiresUpload = (definition: TaskDefinition): boolean => {
  if (!definition || !definition.steps) return false;
  
  return definition.steps.some(step => step.type === 'upload');
};

export const getMainContent = (definition: TaskDefinition): string | undefined => {
  if (!definition || !definition.steps) return undefined;
  
  const contentStep = definition.steps.find(step => step.type === 'content');
  if (contentStep && typeof contentStep.content === 'string') {
    return contentStep.content;
  } else if (contentStep && Array.isArray(contentStep.content)) {
    return contentStep.content.join('\n');
  }
  
  return undefined;
};

export const getMainQuestion = (definition: TaskDefinition): string | undefined => {
  if (!definition || !definition.steps) return undefined;
  
  const questionStep = definition.steps.find(step => step.type === 'question');
  if (questionStep && typeof questionStep.question === 'string') {
    return questionStep.question;
  }
  
  return undefined;
};

// Re-export workload function for convenience
export { getTaskWorkload };
