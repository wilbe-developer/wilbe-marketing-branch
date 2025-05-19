
export type InputType = "radio" | "boolean" | "select" | "multiselect" | "textarea" | "text" | "form" | "conditionalQuestion" | "groupedQuestions";
export type StepType = "question" | "content" | "file" | "exercise" | "form" | "conditionalQuestion" | "groupedQuestions";
export type ConditionOperator = "equals" | "not_equals" | "in" | "not_in";
export type ProfileQuestionType = "boolean" | "select" | "multiselect" | "text";

export interface ProfileQuestion {
  key: string;
  text: string;
  type: ProfileQuestionType;
  options?: string[];
}

export interface Option {
  label: string;
  value: string;
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

export interface ConditionSource {
  profileKey?: string;
  stepId?: string;
  fieldId?: string; // For referencing a specific field within the same step
}

export interface Condition {
  source: ConditionSource;
  operator: ConditionOperator;
  value: string | number | boolean | any[];
}

export interface StepNode {
  id: string;
  type: StepType;
  text: string;
  inputType?: InputType;
  options?: Option[];
  conditions?: Condition[];
  onAnswer?: Record<string, StepNode[]>;
  children?: StepNode[];
  
  // New fields for enhanced functionality
  fields?: FormField[]; // For multiple inputs in a single step
  conditionalInputs?: Record<string, FormField[]>; // Map option values to additional fields
  questions?: StepNode[]; // For grouped questions in one step
}

export interface StaticPanelItem {
  text: string;
  order?: number;
}

export interface StaticPanel {
  id: string;
  title: string;
  conditions?: Condition[];
  items: StaticPanelItem[];
}

export interface TaskDefinition {
  taskName: string;
  description?: string;
  profileQuestions: ProfileQuestion[];
  steps: StepNode[];
  staticPanels?: StaticPanel[];
  order_index?: number;
  category?: string;
}

export interface SprintTaskDefinition {
  id: string;
  name: string;
  description?: string;
  definition: TaskDefinition;
  created_at: string;
  updated_at: string;
}
