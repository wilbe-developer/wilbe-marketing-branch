
import { TaskDefinition, StepNode } from '@/types/task-builder';

export type WorkloadLevel = 'low' | 'medium' | 'high';

export interface WorkloadIndicator {
  level: WorkloadLevel;
  label: string;
  color: string;
  bgColor: string;
  estimatedTime: string;
}

export const WORKLOAD_INDICATORS: Record<WorkloadLevel, WorkloadIndicator> = {
  low: {
    level: 'low',
    label: 'Low',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    estimatedTime: '15-30 min'
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    estimatedTime: '30-60 min'
  },
  high: {
    level: 'high',
    label: 'High',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    estimatedTime: '1-2 hours'
  }
};

/**
 * Calculate workload score based on task definition complexity
 */
export const calculateWorkloadScore = (definition: TaskDefinition): number => {
  if (!definition || !definition.steps) return 0;
  
  let score = 0;
  const steps = definition.steps;
  
  // Base score for number of steps
  score += steps.length * 2;
  
  // Analyze each step
  steps.forEach(step => {
    switch (step.type) {
      case 'upload':
        score += 8; // File uploads are time-consuming
        break;
      case 'question':
        if (step.options && step.options.length > 0) {
          score += 3; // Multiple choice questions
        } else {
          score += 5; // Free text questions require more thought
        }
        break;
      case 'content':
        score += 1; // Reading content is quick
        break;
      default:
        score += 2;
    }
    
    // Add complexity for conditional logic (if conditions exist)
    if (step.conditions && step.conditions.length > 0) {
      score += 2;
    }
  });
  
  // Profile questions add complexity
  if (definition.profileQuestions && definition.profileQuestions.length > 0) {
    score += definition.profileQuestions.length * 3;
  }
  
  return score;
};

/**
 * Convert workload score to workload level
 */
export const scoreToWorkloadLevel = (score: number): WorkloadLevel => {
  if (score <= 15) return 'low';
  if (score <= 35) return 'medium';
  return 'high';
};

/**
 * Calculate workload level for a task definition
 */
export const calculateWorkloadLevel = (definition: TaskDefinition): WorkloadLevel => {
  const score = calculateWorkloadScore(definition);
  return scoreToWorkloadLevel(score);
};

/**
 * Get workload indicator for a task, considering manual override
 */
export const getTaskWorkload = (
  definition: TaskDefinition, 
  manualWorkload?: string | null
): WorkloadIndicator => {
  // Use manual override if provided and valid
  if (manualWorkload && ['low', 'medium', 'high'].includes(manualWorkload)) {
    return WORKLOAD_INDICATORS[manualWorkload as WorkloadLevel];
  }
  
  // Calculate algorithmically
  const level = calculateWorkloadLevel(definition);
  return WORKLOAD_INDICATORS[level];
};
