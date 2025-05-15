
import { ReactNode } from "react";

export type StepContextType = 
  | "answer" 
  | "text_input" 
  | "date_input" 
  | "multiple_choice" 
  | "team_member" 
  | "skill" 
  | "file_upload";

export interface StepContext {
  type: StepContextType;
  data?: any;
  answer?: any; // Some older code might still use this property
}

export interface EnhancedStep {
  type: "content" | "form" | "question" | "upload";
  title?: string;
  description?: string;
  context?: StepContextType;
  content: ReactNode[] | ReactNode;
  question?: string;
  options?: Array<{ label: string; value: string }>;
  uploads?: string[];
  hidden?: boolean;
}
