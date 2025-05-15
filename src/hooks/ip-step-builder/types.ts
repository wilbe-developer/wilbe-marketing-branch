
import { ReactNode } from "react";

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

export type IpStepContextType =
  | "reliance"
  | "tto"
  | "ownership"
  | "patents"
  | "general"
  | "uni_specific";

export type IpStepContext = {
  type: IpStepContextType;
  data?: any;
};
