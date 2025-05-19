
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
