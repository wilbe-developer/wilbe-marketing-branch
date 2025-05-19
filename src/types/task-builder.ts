
export * from './task-builder/index';

export interface SprintTaskDefinition {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  definition: TaskDefinition;
}

export interface TaskDefinition {
  taskName: string;
  description?: string;
  
  // Core fields for task functionality
  steps: StepNode[];
  profileQuestions?: ProfileQuestion[];
  staticPanels?: StaticPanel[];
  
  // Display and metadata fields
  category?: string;
  coverImage?: string;
  estimatedTime?: string;
  difficulty?: string;
  order_index?: number;
  
  // Custom fields that can be extended as needed
  customFields?: Record<string, any>;
}

export interface StepNode {
  id: string;
  type: StepType;
  text: string;
  description?: string;
  
  // Fields for different step types
  inputType?: InputType;
  options?: Option[];
  uploadConfig?: UploadConfig;
  content?: string;
  
  // Conditional visibility
  conditions?: Condition[];
  
  // Parent-child structure for nested steps
  parentId?: string;
  children?: StepNode[];
  
  // Conditional navigation based on answers
  onAnswer?: Record<string, StepNode[]>;
  
  // New fields for enhanced functionality
  fields?: FormField[]; // For multiple inputs in a single step
  conditionalInputs?: Record<string, FormField[]>; // Map option values to additional fields
  questions?: StepNode[]; // For grouped questions in one step
  
  // Team member specific fields
  memberType?: string; // "Co-founder", "Team Member", etc.
  allowMultiple?: boolean; // Whether to allow adding multiple entries
  initialCount?: number; // Initial number of entries to show
}

export type StepType = 
  | 'question'    // Multiple choice or input question
  | 'content'     // Static content/info
  | 'upload'      // File upload component
  | 'feedback'    // Feedback or evaluation
  | 'action'      // User needs to take some action
  | 'file'        // Alternate name for upload
  | 'exercise'    // Exercise step
  | 'form'        // Form with multiple fields
  | 'conditionalQuestion' // Question with conditional follow-up fields
  | 'groupedQuestions'    // Container for multiple sub-questions
  | 'team-members' // Team/co-founder member form
  | 'container';  // Container for child steps

export type InputType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'multiselect'
  | 'date'
  | 'number'
  | 'email'
  | 'url'
  | 'boolean'
  | 'file';

export interface Option {
  label: string;
  value: string;
  description?: string;
  nextStepId?: string;
  conditionalInput?: FormField; // Added for follow-up inputs when this option is selected
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "content";
  placeholder?: string;
  required?: boolean;
  options?: Option[];
  conditions?: Condition[]; // For conditional visibility within a form
  text?: string;    // For content fields to display text
  content?: string; // For content fields to display HTML content
}

export interface UploadConfig {
  allowedFileTypes?: string[];
  maxSizeInMB?: number;
  required?: boolean;
  multiple?: boolean;
}

export interface ProfileQuestion {
  key: string;
  text: string;
  type: ProfileQuestionType;
  description?: string;
  options?: string[]; // For select/multiselect types
  defaultValue?: any;
  required?: boolean;
}

export type ProfileQuestionType = 'boolean' | 'text' | 'select' | 'multiselect';

export interface StaticPanelItem {
  text: string;
  order?: number;
}

export interface StaticPanel {
  id: string;
  title?: string;
  content?: string;
  items?: StaticPanelItem[]; // Support either content or items[]
  type?: 'info' | 'warning' | 'success' | 'error';
  conditions?: Condition[];
}

export interface Condition {
  source: ConditionSource;
  operator: ConditionOperator;
  value: any;
}

export type ConditionOperator = 'equals' | 'not_equals' | 'in' | 'not_in';

// Using a proper discriminated union for ConditionSource
export type ConditionSource = 
  | { profileKey: string; stepId?: never; fieldId?: never }  // Source is a profile answer
  | { stepId: string; profileKey?: never; fieldId?: never }  // Source is a step answer
  | { fieldId: string; stepId?: never; profileKey?: never };  // Source is a field within the same step
