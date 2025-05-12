
import React from "react";
import { EnhancedStep } from "./types";
import CompanyReasonStep from "@/components/sprint/step-types/CompanyReasonStep";

export const getCompanySteps = (
  companyReasons: string[],
  onCompanyReasonsChange: (reasons: string[]) => void
): EnhancedStep[] => {
  return [
    {
      type: "content", // This matches a valid StepType
      context: "company_reason",
      content: [
        <CompanyReasonStep
          key="company-reasons" 
          selectedReasons={companyReasons}
          onReasonsChange={onCompanyReasonsChange}
        />
      ]
    }
  ];
};
