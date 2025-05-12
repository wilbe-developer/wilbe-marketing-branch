
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface CompanyReason {
  id: string;
  reason: string;
}

const COMPANY_REASONS: CompanyReason[] = [
  { id: "tech_solution", reason: "I have a technical solution that solves a problem" },
  { id: "identified_problem", reason: "I've identified a problem and want to solve it" },
  { id: "market_gap", reason: "There's a gap in the market I want to fill" },
  { id: "personal_experience", reason: "I've experienced this problem myself" },
  { id: "industry_expertise", reason: "I have industry expertise that gives me an advantage" },
  { id: "research_commercialization", reason: "I want to commercialize my research" },
  { id: "passion", reason: "I'm passionate about this idea" },
  { id: "societal_impact", reason: "I want to make a positive impact on society" },
  { id: "financial_opportunity", reason: "I see a financial opportunity" }
];

interface CompanyReasonStepProps {
  selectedReasons: string[];
  onReasonsChange: (reasons: string[]) => void;
  onContinue: () => void;
}

const CompanyReasonStep: React.FC<CompanyReasonStepProps> = ({
  selectedReasons,
  onReasonsChange,
  onContinue
}) => {
  const [otherReason, setOtherReason] = useState<string>("");

  const handleCheckboxChange = (reasonId: string) => {
    if (selectedReasons.includes(reasonId)) {
      onReasonsChange(selectedReasons.filter(id => id !== reasonId));
    } else {
      onReasonsChange([...selectedReasons, reasonId]);
    }
  };

  const isReady = selectedReasons.length > 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">What motivated you to start a company?</h3>
      <p className="text-sm text-gray-600 mb-4">Select all that apply to you</p>
      
      <div className="space-y-3">
        {COMPANY_REASONS.map((reason) => (
          <div key={reason.id} className="flex items-start space-x-2">
            <Checkbox 
              id={`reason-${reason.id}`}
              checked={selectedReasons.includes(reason.id)}
              onCheckedChange={() => handleCheckboxChange(reason.id)}
              className="mt-1"
            />
            <Label 
              htmlFor={`reason-${reason.id}`} 
              className="cursor-pointer"
            >
              {reason.reason}
            </Label>
          </div>
        ))}
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={onContinue}
          disabled={!isReady}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CompanyReasonStep;
