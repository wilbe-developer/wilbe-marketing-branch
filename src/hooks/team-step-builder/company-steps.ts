
import React from "react";
import { EnhancedStep } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const getCompanySteps = (
  companyReasons: string[],
  onCompanyReasonsChange: (reasons: string[]) => void
): EnhancedStep[] => {
  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      onCompanyReasonsChange([...companyReasons, reason]);
    } else {
      onCompanyReasonsChange(companyReasons.filter(r => r !== reason));
    }
  };

  return [
    {
      type: "content",
      context: "company_reason",
      content: [
        "Why are you building a company?",
        <div key="company-reasons" className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reason-funding" 
              checked={companyReasons.includes('funding')}
              onCheckedChange={(checked) => handleReasonChange('funding', checked as boolean)}
            />
            <Label htmlFor="reason-funding">To raise funding</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reason-commercialize" 
              checked={companyReasons.includes('commercialize')}
              onCheckedChange={(checked) => handleReasonChange('commercialize', checked as boolean)}
            />
            <Label htmlFor="reason-commercialize">To commercialize research/IP</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reason-team" 
              checked={companyReasons.includes('team')}
              onCheckedChange={(checked) => handleReasonChange('team', checked as boolean)}
            />
            <Label htmlFor="reason-team">To build a team</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reason-impact" 
              checked={companyReasons.includes('impact')}
              onCheckedChange={(checked) => handleReasonChange('impact', checked as boolean)}
            />
            <Label htmlFor="reason-impact">To create impact</Label>
          </div>
        </div>
      ]
    }
  ];
};
