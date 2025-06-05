import { SprintTaskDefinition, StepNode, Condition } from "@/types/task-builder";
import { getTaskWorkload } from "@/utils/workloadCalculation";

// Function to generate a summary of a task definition for display
export const generateTaskSummary = (taskDef: SprintTaskDefinition) => {
  const definition = taskDef.definition;
  
  // Get the main title from the task name
  const title = definition.taskName || taskDef.name;
  
  // Get the description from the definition or use the taskDef description
  const description = definition.description || taskDef.description;
  
  // Determine if this task requires a file upload
  const requiresUpload = definition.steps.some(step => 
    step.type === 'file' || step.type === 'upload'
  );
  
  // Get the category if available
  const category = definition.category;
  
  // Try to find a main question
  let mainQuestion = '';
  for (const step of definition.steps) {
    if (step.type === 'question') {
      mainQuestion = step.text;
      break;
    }
  }
  
  // Use only the dedicated summary field if available
  const content = definition.summary || '';
  
  // Get the order index if available
  const order_index = definition.order_index || 0;
  
  return {
    title,
    description,
    requiresUpload,
    category,
    mainQuestion,
    content,
    order_index
  };
};

// Utility function to check if a task requires file upload
export const requiresUpload = (taskDef: SprintTaskDefinition): boolean => {
  if (!taskDef.definition || !taskDef.definition.steps) return false;
  
  return taskDef.definition.steps.some(step => 
    step.type === 'file' || step.type === 'upload'
  );
};

// Utility function to get the main content from a task
export const getMainContent = (taskDef: SprintTaskDefinition): string => {
  if (!taskDef.definition || !taskDef.definition.steps) return '';
  
  const contentStep = taskDef.definition.steps.find(step => step.type === 'content');
  if (contentStep && contentStep.content) {
    return contentStep.content.toString();
  }
  return '';
};

// Utility function to get the main question from a task
export const getMainQuestion = (taskDef: SprintTaskDefinition): string => {
  if (!taskDef.definition || !taskDef.definition.steps) return '';
  
  for (const step of taskDef.definition.steps) {
    if (step.type === 'question') {
      return step.text;
    }
  }
  return '';
};

// Utility function to flatten a step tree into a linear array
export const flattenSteps = (steps: StepNode[]): StepNode[] => {
  const result: StepNode[] = [];
  
  const processStep = (step: StepNode) => {
    result.push(step);
    
    if (step.children && step.children.length > 0) {
      step.children.forEach(processStep);
    }
  };
  
  steps.forEach(processStep);
  return result;
};

// Utility function to evaluate if a step should be visible based on conditions
export const evaluateStepVisibility = (
  step: StepNode, 
  profile: Record<string, any>,
  answers: Record<string, any>
): boolean => {
  if (!step.conditions || step.conditions.length === 0) {
    return true;
  }
  
  return step.conditions.every(condition => {
    const sourceValue = condition.source.profileKey 
      ? profile[condition.source.profileKey]
      : answers[condition.source.stepId || ''];
      
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
        return false;
    }
  });
};

// Add workload extraction function
export const extractTaskWorkload = (taskDef: SprintTaskDefinition) => {
  return getTaskWorkload(taskDef.definition, taskDef.workload);
};
