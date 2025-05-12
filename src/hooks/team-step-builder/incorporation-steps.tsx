
import React from "react";
import { EnhancedStep } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EQUITY_SPLIT_VIDEO_ID = "yVXVJGJ4e8w";

export const getIncorporationSteps = (
  isIncorporated: boolean | undefined,
  companyFormationDate: string,
  companyFormationLocation: string,
  plannedFormationDate: string,
  plannedFormationLocation: string,
  formationLocationReason: string,
  equityAgreed: boolean | null,
  equitySplit: string,
  equityConcerns: string,
  onCompanyFormationDateChange: (value: string) => void,
  onCompanyFormationLocationChange: (value: string) => void,
  onPlannedFormationDateChange: (value: string) => void,
  onPlannedFormationLocationChange: (value: string) => void,
  onFormationLocationReasonChange: (value: string) => void,
  onEquityAgreedChange: (value: boolean | null) => void,
  onEquitySplitChange: (value: string) => void,
  onEquityConcernsChange: (value: string) => void
): EnhancedStep[] => {
  if (isIncorporated === undefined) {
    return [];
  }
  
  const steps: EnhancedStep[] = [];
  
  // Add incorporation-specific questions
  if (isIncorporated) {
    // If incorporated, ask about formation details
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        "Where and when was your company formed / incorporated?",
        <div key="formation-details" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="formation-date" className="mb-2 block">When</Label>
            <Input 
              id="formation-date"
              value={companyFormationDate}
              onChange={(e) => onCompanyFormationDateChange(e.target.value)}
              placeholder="e.g., January 2023"
            />
          </div>
          <div>
            <Label htmlFor="formation-location" className="mb-2 block">Where</Label>
            <Input 
              id="formation-location"
              value={companyFormationLocation}
              onChange={(e) => onCompanyFormationLocationChange(e.target.value)}
              placeholder="e.g., Delaware, USA"
            />
          </div>
        </div>
      ]
    });
    
    // Ask about equity split
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        "List equity split among all stakeholders including founders",
        <div key="equity-split" className="mt-4">
          <Textarea 
            value={equitySplit}
            onChange={(e) => onEquitySplitChange(e.target.value)}
            placeholder="e.g., Founder A (CEO): 50%, Founder B (CTO): 40%, Advisor: 10%"
            rows={5}
            className="w-full"
          />
        </div>
      ]
    });
  } else {
    // If not incorporated, ask about planned formation
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        "When and where do you plan to form / incorporate the company?",
        <div key="planned-formation" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="planned-date" className="mb-2 block">When</Label>
            <Input 
              id="planned-date"
              value={plannedFormationDate}
              onChange={(e) => onPlannedFormationDateChange(e.target.value)}
              placeholder="e.g., Next quarter"
            />
          </div>
          <div>
            <Label htmlFor="planned-location" className="mb-2 block">Where</Label>
            <RadioGroup
              value={plannedFormationLocation}
              onValueChange={onPlannedFormationLocationChange}
              className="space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="US" id="location-us" />
                <Label htmlFor="location-us">US</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UK" id="location-uk" />
                <Label htmlFor="location-uk">UK</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="location-other" />
                <Label htmlFor="location-other">Other</Label>
              </div>
            </RadioGroup>
            
            {plannedFormationLocation === "Other" && (
              <Input 
                className="mt-2"
                placeholder="Please specify"
                value={plannedFormationLocation}
                onChange={(e) => onPlannedFormationLocationChange(e.target.value)}
              />
            )}
          </div>
        </div>
      ]
    });
    
    // Ask about location rationale
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        "Why did you pick this location?",
        <div key="location-reason" className="mt-4">
          <Textarea 
            value={formationLocationReason}
            onChange={(e) => onFormationLocationReasonChange(e.target.value)}
            placeholder="Explain your reasoning..."
            rows={4}
            className="w-full"
          />
        </div>
      ]
    });
    
    // Ask about equity agreement
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        "Have you agreed on the equity split among the team?",
        <div key="equity-agreement" className="space-y-4 mt-4">
          <RadioGroup
            value={equityAgreed === null ? "" : equityAgreed ? "yes" : "no"}
            onValueChange={(value) => onEquityAgreedChange(value === "yes" ? true : value === "no" ? false : null)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="equity-agreed-yes" />
              <Label htmlFor="equity-agreed-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="equity-agreed-no" />
              <Label htmlFor="equity-agreed-no">No</Label>
            </div>
          </RadioGroup>
          
          {equityAgreed && (
            <div className="mt-4">
              <Label htmlFor="agreed-equity-split" className="mb-2 block">List the equity split</Label>
              <Textarea 
                id="agreed-equity-split"
                value={equitySplit}
                onChange={(e) => onEquitySplitChange(e.target.value)}
                placeholder="e.g., Founder A (CEO): 50%, Founder B (CTO): 40%, Advisor: 10%"
                rows={4}
                className="w-full"
              />
            </div>
          )}
        </div>
      ]
    });
  }
  
  // Add the equity education content for all users
  steps.push({
    type: "content",
    context: "incorporation",
    content: [
      "Use of equity as a tool not as credit",
      <div key="equity-guidance" className="p-4 bg-blue-50 rounded-lg mt-4">
        <p className="text-blue-800">This is a placeholder for content about equity as a tool rather than credit.</p>
      </div>
    ]
  });
  
  // Add the optional equity concerns question
  steps.push({
    type: "content",
    context: "incorporation",
    content: [
      "If you have any concerns about the current or future equity split, explain here.",
      <div key="equity-concerns" className="mt-4">
        <Textarea 
          value={equityConcerns}
          onChange={(e) => onEquityConcernsChange(e.target.value)}
          placeholder="Optional - share any concerns or questions you have about equity"
          rows={4}
          className="w-full"
        />
      </div>
    ]
  });
  
  return steps;
};
