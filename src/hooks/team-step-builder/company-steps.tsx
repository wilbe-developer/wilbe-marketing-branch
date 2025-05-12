
import React from "react";
import { EnhancedStep } from "./types";
import CompanyReasonStep from "@/components/sprint/step-types/CompanyReasonStep";

export const getCompanySteps = (
  companyReasons: string[],
  onCompanyReasonsChange: (reasons: string[]) => void
): EnhancedStep[] => {
  return [
    {
      type: "content",
      context: "company_reason",
      content: [
        "Why are you building a company?",
        <CompanyReasonStep
          key="company-reasons" 
          selectedReasons={companyReasons}
          onReasonsChange={onCompanyReasonsChange}
        />
      ]
    }
  ];
};
