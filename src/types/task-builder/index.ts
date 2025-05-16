
export type InputType = "radio" | "boolean" | "select" | "multiselect" | "textarea" | "text";
export type StepType = "question" | "content" | "file" | "exercise";
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
}

export interface ConditionSource {
  profileKey?: string;
  stepId?: string;
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
  order_index?: number; // Add order_index field
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
