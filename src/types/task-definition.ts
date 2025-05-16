
import { ReactNode } from "react";

// Step context type for consistent typing across components
export type TaskStepContextType = 
  | "company"
  | "company_reason" 
  | "incorporation"
  | "team"
  | "ip"
  | "market"
  | "funding"
  | "product";

// Generic step type for all kinds of steps
export interface TaskStep {
  id: string; // Unique identifier for the step
  type: "question" | "content" | "upload" | "form";
  title?: string;
  question?: string;
  content?: string | ReactNode | (string | ReactNode)[];
  options?: Array<{ label: string; value: string }>;
  context?: TaskStepContextType;
  action?: string;
  uploads?: string[];
  profileDependencies?: string[]; // Profile fields this step depends on
  hidden?: boolean;
}

// Conditional flow definition
export interface ConditionalFlow {
  [stepIndex: number]: {
    [answer: string]: number; // Maps answers to next step indices
  };
}

// Answer mapping configuration
export interface AnswerMapping {
  [stepIndex: number]: string; // Maps step index to semantic key
}

// Complete task definition schema
export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  category?: string;
  
  // Core task configuration
  steps: TaskStep[];
  conditionalFlow?: ConditionalFlow;
  answerMapping?: AnswerMapping;
  
  // Profile integration
  profileKey?: string; // Main profile field to check/ask
  profileLabel?: string; // Label for profile question
  profileType?: "string" | "boolean" | "select" | "multi-select";
  profileOptions?: Array<{ label: string; value: string }>;
}
