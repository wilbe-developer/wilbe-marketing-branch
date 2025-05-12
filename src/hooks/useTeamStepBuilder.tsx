
import React from "react";
import { Step } from "@/components/sprint/StepBasedTaskLogic";
import TeamMemberForm from "@/components/sprint/step-types/TeamMemberForm";
import { TeamMember } from "./useTeamMembers";
import VideoEmbed from "@/components/video-player/VideoEmbed";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUploader from "@/components/sprint/FileUploader";
import UploadedFileView from "@/components/sprint/UploadedFileView";
import CompanyReasonStep from "@/components/sprint/step-types/CompanyReasonStep";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

const TEAM_BUILDING_VIDEO_ID = "j5TEYCrLDYo";
const EQUITY_SPLIT_VIDEO_ID = "yVXVJGJ4e8w";
const HIRING_TEMPLATE_PLACEHOLDER = "/hiring-template-placeholder.pdf";

interface UseTeamStepBuilderProps {
  teamStatus: string | undefined;
  isIncorporated: boolean;
  teamMembers: TeamMember[];
  neededSkills: string;
  uploadedFileId?: string;
  hiringPlanStep: 'download' | 'upload';
  companyReasons: string[];
  
  // Incorporation data
  companyFormationDate: string;
  companyFormationLocation: string;
  plannedFormationDate: string;
  plannedFormationLocation: string;
  formationLocationReason: string;
  
  // Equity data
  equityAgreed: boolean | null;
  equitySplit: string;
  equityConcerns: string;
  
  // Handlers
  onTeamMemberAdd: () => void;
  onTeamMemberRemove: (index: number) => void;
  onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string) => void;
  onSkillsChange: (skills: string) => void;
  onFileUpload: (fileId: string) => void;
  onHiringPlanStepChange: (step: 'download' | 'upload') => void;
  onCompanyReasonsChange: (reasons: string[]) => void;
  
  // Incorporation data handlers
  onCompanyFormationDateChange: (value: string) => void;
  onCompanyFormationLocationChange: (value: string) => void;
  onPlannedFormationDateChange: (value: string) => void;
  onPlannedFormationLocationChange: (value: string) => void;
  onFormationLocationReasonChange: (value: string) => void;
  
  // Equity data handlers
  onEquityAgreedChange: (value: boolean | null) => void;
  onEquitySplitChange: (value: string) => void;
  onEquityConcernsChange: (value: string) => void;
}

// Define step contexts to be used for displaying the right profile info
export type StepContext = 'company_reason' | 'incorporation' | 'team';

interface EnhancedStep extends Step {
  context?: StepContext;
}

export const useTeamStepBuilder = ({
  teamStatus,
  isIncorporated,
  teamMembers,
  neededSkills,
  uploadedFileId,
  hiringPlanStep,
  companyReasons,
  
  // Incorporation data
  companyFormationDate,
  companyFormationLocation,
  plannedFormationDate,
  plannedFormationLocation,
  formationLocationReason,
  
  // Equity data
  equityAgreed,
  equitySplit,
  equityConcerns,
  
  // Handlers
  onTeamMemberAdd,
  onTeamMemberRemove,
  onTeamMemberUpdate,
  onSkillsChange,
  onFileUpload,
  onHiringPlanStepChange,
  onCompanyReasonsChange,
  
  // Incorporation data handlers
  onCompanyFormationDateChange,
  onCompanyFormationLocationChange,
  onPlannedFormationDateChange,
  onPlannedFormationLocationChange,
  onFormationLocationReasonChange,
  
  // Equity data handlers
  onEquityAgreedChange,
  onEquitySplitChange,
  onEquityConcernsChange
}: UseTeamStepBuilderProps): EnhancedStep[] => {
  // Start with the standalone step that all users see
  const steps: EnhancedStep[] = [
    // Step 1: Company Reason - all users see this
    {
      type: "content",
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

  // Steps for incorporation
  if (isIncorporated !== undefined) {
    // Step 2: Show incorporation status profile information
    steps.push({
      type: "content",
      context: "incorporation",
      content: [
        <div key="incorporation-info" className="mt-1"></div>
      ]
    });
    
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
                  value={plannedFormationLocation !== "US" && plannedFormationLocation !== "UK" && plannedFormationLocation !== "Other" ? plannedFormationLocation : ""}
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
  }
  
  // Now add team status based steps
  if (teamStatus !== undefined) {
    // Show the team status profile information
    steps.push({
      type: "content",
      context: "team",
      content: [
        <div key="team-status-info" className="mt-1"></div>
      ]
    });
    
    // Add team-status specific questions
    if (teamStatus === "solo") {
      steps.push(
        {
          type: "content",
          context: "team",
          content: [
            "As a solo founder, it's crucial to understand the importance of team culture and future team building.",
            <VideoEmbed 
              key="video"
              youtubeEmbedId={TEAM_BUILDING_VIDEO_ID} 
              title="Company Culture and Team Building" 
            />
          ]
        },
        {
          type: "content",
          context: "team",
          content: [
            "What technical skills do you need in your future team?",
            <div key="skills-input" className="mt-4">
              <Textarea 
                value={neededSkills}
                onChange={(e) => onSkillsChange(e.target.value)}
                placeholder="Example: Technical co-founder with expertise in AI, Marketing professional with B2B SaaS experience, etc."
                rows={5}
                className="w-full"
              />
            </div>
          ]
        },
        {
          type: "content",
          context: "team",
          content: [
            "Hiring Plan Template",
            <div key="hiring-plan" className="mt-4 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-700">
                  Download our hiring plan template to help you structure your future team building efforts.
                </p>
                <Button 
                  onClick={() => {
                    window.open(HIRING_TEMPLATE_PLACEHOLDER, '_blank');
                    onHiringPlanStepChange('upload');
                  }}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Hiring Template
                </Button>
              </div>
              
              <div className="space-y-4 mt-8 pt-6 border-t border-gray-200">
                {uploadedFileId ? (
                  <UploadedFileView
                    fileId={uploadedFileId}
                    isCompleted={false}
                  />
                ) : (
                  <FileUploader
                    onFileUploaded={onFileUpload}
                    isCompleted={false}
                  />
                )}
              </div>
            </div>
          ]
        }
      );
    } else {
      // For team or co-founder cases
      const memberType = teamStatus === "employees" ? "team member" : "co-founder";
      
      steps.push(
        {
          type: "content",
          context: "team",
          content: [
            `Tell us about your ${memberType}s`,
            <TeamMemberForm
              key="team-members"
              teamMembers={teamMembers}
              memberType={memberType}
              onAdd={onTeamMemberAdd}
              onRemove={onTeamMemberRemove}
              onUpdate={onTeamMemberUpdate}
            />
          ]
        }
      );
    }
  }

  return steps;
};
