
export interface TaskDefinition {
  id: string;
  title: string;
  category?: string;
  description?: string;
  steps: TaskStep[];
  
  // Profile-related fields
  profileKey?: string;
  profileLabel?: string;
  profileType?: "string" | "boolean" | "select" | "multi-select";
  profileOptions?: any;
  
  // Flow control fields
  conditionalFlow?: Record<number, Record<string, number>>;
  answerMapping?: Record<string, any>;
  
  // Original database fields (snake_case)
  // These will be converted to camelCase but TypeScript needs to know they exist
  profile_key?: string;
  profile_label?: string;
  profile_type?: string;
  profile_options?: any;
  conditional_flow?: any;
  answer_mapping?: any;
  created_at?: string;
  updated_at?: string;
}

export interface TaskStep {
  id: string;
  title?: string;
  description?: string;
  type: "question" | "content" | "upload" | "collaboration" | "form" | "conditionalQuestion" | "team-members" | string;
  showFor?: string[];
  hideFor?: string[];
  required?: boolean;
  options?: any[];
  content?: any;
  dependency?: string;
  
  // Additional fields found in usage but not in original interface
  question?: string;
  action?: string;
  context?: string;
  profileDependencies?: string[];
  uploads?: string[];
}

// Add the missing ConditionalFlow type
export type ConditionalFlow = Record<number, Record<string, number>>;
