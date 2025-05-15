
import { ReactNode } from "react";
import { StepContextType } from "@/hooks/team-step-builder/types";

// Extend the StepContextType to include IP-specific context types
export type IpStepContextType = StepContextType | 
  "reliance" | 
  "tto" | 
  "ownership" | 
  "patents" | 
  "general" | 
  "uni_specific";

export interface EnhancedIpStep {
  type: "content" | "form" | "question" | "upload";
  title?: string;
  description?: string;
  context?: IpStepContextType;
  content: ReactNode[] | ReactNode;
  question?: string;
  options?: Array<{ label: string; value: string }>;
  uploads?: string[];
  hidden?: boolean;
}

export type IpStepContext = {
  type: IpStepContextType;
  data?: any;
};
