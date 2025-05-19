
import { TaskStep } from "@/types/task-definition";
import { Step, StepType } from "@/components/sprint/StepBasedTaskLogic";

/**
 * Normalizes a step type to ensure it matches one of the supported StepType values
 * @param type The original step type string
 * @returns A normalized StepType
 */
export const normalizeStepType = (type: string | undefined): StepType => {
  if (!type) return 'content'; // Default to content if no type is provided
  
  // Convert to lowercase for case-insensitive comparison
  const lowerCaseType = type.toLowerCase();
  
  // Log the type being normalized for debugging
  console.log(`Normalizing step type: ${type} (lowercase: ${lowerCaseType})`);
  
  // Map various type strings to the standard StepType values
  if (lowerCaseType === 'form' || 
      lowerCaseType === 'question' || 
      lowerCaseType === 'conditionalquestion') {
    return 'question';
  } 
  
  if (lowerCaseType === 'collaboration' || 
      lowerCaseType === 'team-members') {
    return 'collaboration';
  } 
  
  if (lowerCaseType === 'upload' || 
      lowerCaseType === 'file') {
    return 'upload';
  } 
  
  if (lowerCaseType === 'content') {
    return 'content';
  }
  
  if (lowerCaseType === 'exercise' || 
      lowerCaseType === 'feedback' || 
      lowerCaseType === 'action') {
    return 'exercise';
  } 
  
  // If we don't recognize the type, log a warning and default to content
  console.warn(`Unknown step type encountered: ${type}. Defaulting to 'content'`);
  return 'content';
};

/**
 * Converts a TaskStep to a Step compatible with StepBasedTaskLogic
 * @param taskStep The original TaskStep from task definition
 * @returns A Step object compatible with StepBasedTaskLogic
 */
export const convertTaskStepToStep = (taskStep: TaskStep): Step => {
  // Normalize the step type
  const normalizedType = normalizeStepType(taskStep.type);
  
  // Log for debugging
  console.log(`Converting step type from ${taskStep.type} to ${normalizedType}`);
  
  // Create a Step with normalized properties
  return {
    ...taskStep,
    id: taskStep.id,
    type: normalizedType,
    question: taskStep.question || taskStep.title || '',
    description: taskStep.description || '',
    context: taskStep.context || undefined,
    uploads: taskStep.uploads || [],
    action: taskStep.action || undefined,
    memberType: taskStep.memberType || undefined
  } as Step;
};
