
import { StepContextType } from "./types";

export interface IPFormData {
  ttoConversationSummary?: string;
  preliminaryTerms?: string;
  ttoEngagementPlans?: string;
  patentsFilingPlans?: string;
  ipOwnershipStatus?: string;
}

export type IPStepContext = StepContextType | "ip_status" | "tto_status";

