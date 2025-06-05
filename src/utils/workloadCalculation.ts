
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
 * Count total form fields across all steps
 */
const countFormFields = (steps: StepNode[]): number => {
  let count = 0;
  
  steps.forEach(step => {
    // Count fields array if present
    if (step.fields && Array.isArray(step.fields)) {
      count += step.fields.length;
    }
    
    // Count conditional inputs
    if (step.conditionalInputs) {
      Object.values(step.conditionalInputs).forEach(fieldArray => {
        if (Array.isArray(fieldArray)) {
          count += fieldArray.length;
        }
      });
    }
    
    // Count options for radio/select inputs
    if (step.options && step.options.length > 0) {
      count += 1; // The question itself
      // Count conditional inputs from options
      step.options.forEach(option => {
        if (option.conditionalInput) {
          count += 1;
        }
      });
    }
    
    // Basic input questions count as 1 field
    if (step.type === 'question' && !step.fields) {
      count += 1;
    }
    
    // Recursively count child steps
    if (step.children && step.children.length > 0) {
      count += countFormFields(step.children);
    }
  });
  
  return count;
};

/**
 * Detect team-related complexity
 */
const getTeamComplexity = (steps: StepNode[]): number => {
  let score = 0;
  
  steps.forEach(step => {
    // Team member steps are highly complex
    if (step.type === 'team-members') {
      score += 15;
    }
    
    // Collaboration fields add complexity
    if (step.fields) {
      step.fields.forEach(field => {
        if (field.type === 'collaboration') {
          score += 5;
        }
      });
    }
    
    // Check for team-related keywords in step text
    const text = (step.text || '').toLowerCase();
    if (text.includes('team') || text.includes('founder') || text.includes('member')) {
      score += 3;
    }
    
    // Recursively check child steps
    if (step.children && step.children.length > 0) {
      score += getTeamComplexity(step.children);
    }
  });
  
  return score;
};

/**
 * Analyze content complexity based on static panels
 */
const getContentComplexity = (definition: TaskDefinition): number => {
  let score = 0;
  
  if (definition.staticPanels) {
    definition.staticPanels.forEach(panel => {
      const content = panel.content || '';
      const items = panel.items || [];
      
      // Look for specific numbers indicating complexity
      const complexityIndicators = [
        /\b\d+\s*calls?\b/i,        // "50 calls"
        /\b\d+\s*slides?\b/i,       // "15 slides"
        /\b\d+\s*interviews?\b/i,   // "customer interviews"
        /\b\d+\s*hours?\b/i,        // "10 hours"
        /\bcrm\b/i,                 // "CRM"
        /\bdeck\b/i,                // "deck"
        /\broadmap\b/i,             // "roadmap"
        /\bmilestone\b/i            // "milestone"
      ];
      
      complexityIndicators.forEach(indicator => {
        if (indicator.test(content)) {
          score += 5;
        }
        items.forEach(item => {
          if (indicator.test(item.text || '')) {
            score += 3;
          }
        });
      });
    });
  }
  
  return score;
};

/**
 * Calculate workload score based on task definition complexity
 */
export const calculateWorkloadScore = (definition: TaskDefinition): number => {
  if (!definition || !definition.steps) return 0;
  
  let score = 0;
  const steps = definition.steps;
  
  // Base score for number of steps (reduced weight)
  score += steps.length * 1;
  
  // Form field complexity (major factor)
  const formFieldCount = countFormFields(steps);
  score += formFieldCount * 2;
  
  // Team complexity (high weight)
  score += getTeamComplexity(steps);
  
  // Content complexity from static panels
  score += getContentComplexity(definition);
  
  // Analyze each step for specific complexity
  steps.forEach(step => {
    switch (step.type) {
      case 'upload':
      case 'file':
        score += 8; // File uploads are time-consuming
        break;
      case 'team-members':
        score += 15; // Team forms are very complex
        break;
      case 'form':
        score += 10; // Multi-field forms are complex
        break;
      case 'question':
        if (step.options && step.options.length > 4) {
          score += 5; // Complex multiple choice
        } else if (step.options && step.options.length > 0) {
          score += 3; // Simple multiple choice
        } else {
          score += 4; // Free text questions require thought
        }
        break;
      case 'content':
        score += 1; // Reading content is quick
        break;
      case 'exercise':
        score += 6; // Exercises require effort
        break;
      default:
        score += 2;
    }
    
    // Add complexity for conditional logic
    if (step.conditions && step.conditions.length > 0) {
      score += 3; // Increased from 2
    }
    
    // Add complexity for grouped questions
    if (step.questions && step.questions.length > 0) {
      score += step.questions.length * 2;
    }
  });
  
  // Profile questions add complexity
  if (definition.profileQuestions && definition.profileQuestions.length > 0) {
    score += definition.profileQuestions.length * 3;
  }
  
  // Category-based adjustments
  if (definition.category) {
    const category = definition.category.toLowerCase();
    if (category.includes('team')) {
      score += 10; // Team tasks are inherently complex
    } else if (category.includes('funding') || category.includes('market')) {
      score += 5; // Medium complexity categories
    }
  }
  
  return score;
};

/**
 * Convert workload score to workload level (adjusted thresholds)
 */
export const scoreToWorkloadLevel = (score: number): WorkloadLevel => {
  if (score <= 10) return 'low';    // Reduced from 15
  if (score <= 25) return 'medium'; // Reduced from 35
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
