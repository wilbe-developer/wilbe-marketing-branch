
import { ReactNode } from "react";
import { TeamMember } from "../team-members/types";

export interface EnhancedStep {
  type: "content" | "form";
  title?: string;
  description?: string;
  context?: StepContextType;
  content: ReactNode[] | ReactNode;
  hidden?: boolean;
}

export type StepContextType =
  | "company"
  | "company_reason"
  | "incorporation"
  | "team";

export type StepContext = {
  type: StepContextType;
  data?: any;
};
