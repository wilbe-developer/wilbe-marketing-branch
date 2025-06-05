
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
      score += 20; // Increased for major complexity
    }
    
    // Collaboration fields add complexity
    if (step.fields) {
      step.fields.forEach(field => {
        if (field.type === 'collaboration') {
          score += 8; // Increased for collaboration complexity
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
 * Analyze content complexity based on static panels - more selective
 */
const getContentComplexity = (definition: TaskDefinition): number => {
  let score = 0;
  
  if (definition.staticPanels) {
    definition.staticPanels.forEach(panel => {
      const content = panel.content || '';
      const items = panel.items || [];
      
      // Look for specific high-complexity indicators only
      const complexityIndicators = [
        /\b50\+?\s*calls?\b/i,        // "50+ calls", "50 calls"
        /\b15\s*slides?\b/i,          // "15 slides"
        /\b\d+\s*interviews?\b/i,     // "customer interviews" with numbers
        /\bcrm\s*management\b/i,      // "CRM management"
        /\br&d\s*roadmap\b/i,         // "R&D roadmap"
        /\bcommercial\s*roadmap\b/i   // "commercial roadmap"
      ];
      
      complexityIndicators.forEach(indicator => {
        if (indicator.test(content)) {
          score += 8; // Increased for specific complexity markers
        }
        items.forEach(item => {
          if (indicator.test(item.text || '')) {
            score += 5;
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
  
  // Base score for number of steps (minimal weight)
  score += steps.length * 0.5;
  
  // Form field complexity (reduced weight)
  const formFieldCount = countFormFields(steps);
  score += formFieldCount * 1; // Reduced from 2
  
  // Team complexity (high weight for truly complex tasks)
  score += getTeamComplexity(steps);
  
  // Content complexity from static panels (selective)
  score += getContentComplexity(definition);
  
  // Analyze each step for specific complexity
  steps.forEach(step => {
    switch (step.type) {
      case 'upload':
      case 'file':
        score += 5; // Reduced from 8
        break;
      case 'team-members':
        score += 20; // Increased for major complexity
        break;
      case 'form':
        score += 4; // Reduced from 10
        break;
      case 'question':
        if (step.options && step.options.length > 4) {
          score += 3; // Reduced from 5
        } else if (step.options && step.options.length > 0) {
          score += 2; // Reduced from 3
        } else {
          score += 2; // Reduced from 4
        }
        break;
      case 'content':
        score += 0.5; // Reduced from 1
        break;
      case 'exercise':
        score += 3; // Reduced from 6
        break;
      default:
        score += 1; // Reduced from 2
    }
    
    // Add complexity for conditional logic
    if (step.conditions && step.conditions.length > 0) {
      score += 2; // Reduced from 3
    }
    
    // Add complexity for grouped questions
    if (step.questions && step.questions.length > 0) {
      score += step.questions.length * 1; // Reduced from 2
    }
  });
  
  // Profile questions add minimal complexity
  if (definition.profileQuestions && definition.profileQuestions.length > 0) {
    score += definition.profileQuestions.length * 1; // Reduced from 3
  }
  
  // Category-based adjustments (more selective)
  if (definition.category) {
    const category = definition.category.toLowerCase();
    if (category.includes('team')) {
      score += 15; // Team tasks are inherently very complex
    } else if (category.includes('customer') && category.includes('engagement')) {
      score += 10; // Customer engagement is complex
    } else if (category.includes('execution') || category.includes('iterative')) {
      score += 8; // Execution tasks are moderately complex
    }
  }
  
  return score;
};

/**
 * Convert workload score to workload level (adjusted thresholds)
 */
export const scoreToWorkloadLevel = (score: number): WorkloadLevel => {
  if (score <= 20) return 'low';    // Increased from 10
  if (score <= 45) return 'medium'; // Increased from 25
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
