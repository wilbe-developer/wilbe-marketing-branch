
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface CompanyReason {
  id: string;
  reason: string;
}

const COMPANY_REASONS: CompanyReason[] = [
  { id: "interesting_problem", reason: "I/we find the problem interesting" },
  { id: "professional_research", reason: "I/we have been doing research in this field professionally" },
  { id: "personal_connection", reason: "I/we have a personal connection" },
  { id: "commercial_opportunity", reason: "I/we think it is a great commercial opportunity" },
  { id: "own_ip", reason: "I/we already own the IP" },
  { id: "curiosity", reason: "Just curious" }
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
      <h3 className="text-lg font-medium mb-4">Why are you starting a company (tick all that applies)?</h3>
      
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
          Next
        </Button>
      </div>
    </div>
  );
};

export default CompanyReasonStep;
