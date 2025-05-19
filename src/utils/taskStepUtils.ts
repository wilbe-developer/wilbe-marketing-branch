
export function normalizeStepType(type: string): string {
  // Convert to lowercase for consistent comparison
  const lowercaseType = typeof type === 'string' ? type.toLowerCase() : '';
  
  console.log("Normalizing step type:", type, "(lowercase:", lowercaseType, ")");
  
  // Map alternative type names to standard types
  if (lowercaseType === 'file' || lowercaseType === 'upload') {
    return 'upload';
  }
  
  if (lowercaseType === 'feedback' || lowercaseType === 'action') {
    return 'exercise';
  }
  
  if (lowercaseType === 'conditionalquestion') {
    return 'question';
  }
  
  // For 'team-members' type, preserve it as its own type and don't convert to 'collaboration'
  if (lowercaseType === 'team-members') {
    return 'team-members';
  }
  
  // Return the normalized type or the original if no mapping exists
  const normalizedType = lowercaseType || type;
  console.log("Normalized step type:", normalizedType);
  return normalizedType;
}

// Add the missing function to convert TaskStep to Step
export function convertTaskStepToStep(taskStep: any): any {
  // Create a new object with the required properties for a Step
  return {
    id: taskStep.id || `step-${Math.random().toString(36).substr(2, 9)}`,
    title: taskStep.title || taskStep.text,
    type: normalizeStepType(taskStep.type),
    description: taskStep.description,
    question: taskStep.question,
    options: taskStep.options,
    required: taskStep.required,
    content: taskStep.content,
    action: taskStep.action,
    context: taskStep.context,
    dependency: taskStep.dependency,
    showFor: taskStep.showFor,
    hideFor: taskStep.hideFor,
    profileDependencies: taskStep.profileDependencies,
    uploads: taskStep.uploads,
    memberType: taskStep.memberType,
    // Preserve any other properties
    ...taskStep
  };
}
