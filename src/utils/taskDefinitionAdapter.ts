
import { SprintTaskDefinition, StepNode, Condition } from "@/types/task-builder";
import { getTaskWorkload } from "@/utils/workloadCalculation";
import { parseMarkdown } from "@/utils/markdownUtils";

// Function to generate a summary of a task definition for display
export const generateTaskSummary = (taskDef: SprintTaskDefinition) => {
  const definition = taskDef.definition;
  
  // Get the main title from the task name
  const title = definition.taskName || taskDef.name;
  
  // Get the description from the definition, prioritizing description_markdown
  let description = definition.description || taskDef.description;
  if (definition.description_markdown) {
    description = parseMarkdown(definition.description_markdown);
  }
  
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
  
  // Use the dedicated summary field if available, with markdown parsing
  let content = definition.summary || '';
  if (content) {
    content = parseMarkdown(content);
  }
  
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

// Add workload extraction function with manual override support
export const extractTaskWorkload = (taskDef: SprintTaskDefinition) => {
  // Check if there's a manual time override in the workload field
  if (taskDef.workload && typeof taskDef.workload === 'string') {
    // Check if it's a time format (e.g., "45 min", "1-2 hours")
    const timePattern = /^\d+[-\s]?\d*\s*(min|hour|hr)s?$/i;
    if (timePattern.test(taskDef.workload)) {
      // Create a custom workload indicator with the manual time
      const level = taskDef.workload.includes('hour') || taskDef.workload.includes('hr') ? 'high' : 
                   parseInt(taskDef.workload) > 30 ? 'medium' : 'low';
      
      return {
        level: level as 'low' | 'medium' | 'high',
        label: level.charAt(0).toUpperCase() + level.slice(1),
        color: level === 'low' ? 'text-green-700' : level === 'medium' ? 'text-yellow-700' : 'text-red-700',
        bgColor: level === 'low' ? 'bg-green-100' : level === 'medium' ? 'bg-yellow-100' : 'bg-red-100',
        estimatedTime: taskDef.workload
      };
    }
    
    // Check if it's a workload level (low/medium/high)
    if (['low', 'medium', 'high'].includes(taskDef.workload.toLowerCase())) {
      return getTaskWorkload(taskDef.definition, taskDef.workload);
    }
  }
  
  // Fall back to calculated workload
  return getTaskWorkload(taskDef.definition, taskDef.workload);
};
