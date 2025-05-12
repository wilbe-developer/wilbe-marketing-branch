
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
  equitySplit: string;
  equityRationale: string;
  vestingSchedule: boolean;
  vestingDetails: string;
  equityFormalAgreement: boolean;
  onTeamMemberAdd: () => void;
  onTeamMemberRemove: (index: number) => void;
  onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string) => void;
  onSkillsChange: (skills: string) => void;
  onFileUpload: (fileId: string) => void;
  onHiringPlanStepChange: (step: 'download' | 'upload') => void;
  onCompanyReasonsChange: (reasons: string[]) => void;
  onEquitySplitChange: (value: string) => void;
  onEquityRationaleChange: (value: string) => void;
  onVestingScheduleChange: (value: boolean) => void;
  onVestingDetailsChange: (value: string) => void;
  onEquityFormalAgreementChange: (value: boolean) => void;
}

export const useTeamStepBuilder = ({
  teamStatus,
  isIncorporated,
  teamMembers,
  neededSkills,
  uploadedFileId,
  hiringPlanStep,
  companyReasons,
  equitySplit,
  equityRationale,
  vestingSchedule,
  vestingDetails,
  equityFormalAgreement,
  onTeamMemberAdd,
  onTeamMemberRemove,
  onTeamMemberUpdate,
  onSkillsChange,
  onFileUpload,
  onHiringPlanStepChange,
  onCompanyReasonsChange,
  onEquitySplitChange,
  onEquityRationaleChange,
  onVestingScheduleChange,
  onVestingDetailsChange,
  onEquityFormalAgreementChange
}: UseTeamStepBuilderProps): Step[] => {
  // Start with the common steps that all users see
  const steps: Step[] = [
    // Step 1: Company Reason - all users see this
    {
      type: "content",
      content: [
        <CompanyReasonStep 
          key="company-reasons"
          selectedReasons={companyReasons}
          onReasonsChange={onCompanyReasonsChange}
          onContinue={() => {}} // This is handled by StepBasedTaskLogic
        />
      ]
    }
  ];

  // Steps based on incorporation status
  if (isIncorporated) {
    // Add steps for incorporated companies
    if (teamStatus === "cofounders") {
      steps.push(
        {
          type: "content",
          content: [
            "How is equity split among co-founders?",
            <div key="equity-video" className="mt-4 mb-6">
              <VideoEmbed 
                youtubeEmbedId={EQUITY_SPLIT_VIDEO_ID} 
                title="Equity Split Considerations" 
              />
            </div>,
            <div key="equity-split" className="space-y-4">
              <Textarea 
                value={equitySplit}
                onChange={(e) => onEquitySplitChange(e.target.value)}
                placeholder="Example: Founder A (CEO): 60%, Founder B (CTO): 40%"
                rows={3}
                className="w-full"
              />
            </div>
          ]
        },
        {
          type: "content",
          content: [
            "What was the rationale behind your equity split decision?",
            <div key="equity-rationale" className="mt-4">
              <Textarea 
                value={equityRationale}
                onChange={(e) => onEquityRationaleChange(e.target.value)}
                placeholder="Explain how you decided on the equity allocation..."
                rows={4}
                className="w-full"
              />
            </div>
          ]
        },
        {
          type: "content",
          content: [
            "Do you have a vesting schedule for founder equity?",
            <div key="vesting-schedule" className="mt-4 space-y-4">
              <RadioGroup
                value={vestingSchedule ? "yes" : "no"}
                onValueChange={(value) => onVestingScheduleChange(value === "yes")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vesting-yes" />
                  <Label htmlFor="vesting-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vesting-no" />
                  <Label htmlFor="vesting-no">No</Label>
                </div>
              </RadioGroup>
              
              {vestingSchedule && (
                <div className="pt-2">
                  <Label htmlFor="vesting-details" className="mb-2 block">Please describe your vesting schedule:</Label>
                  <Textarea 
                    id="vesting-details"
                    value={vestingDetails}
                    onChange={(e) => onVestingDetailsChange(e.target.value)}
                    placeholder="Example: 4-year vesting with 1-year cliff..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ]
        },
        {
          type: "content",
          content: [
            "Have you formalized the equity agreement in writing?",
            <div key="formal-agreement" className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="formal-agreement"
                  checked={equityFormalAgreement}
                  onCheckedChange={(checked) => 
                    onEquityFormalAgreementChange(checked === true)
                  }
                />
                <Label htmlFor="formal-agreement">
                  Yes, we have a written and signed agreement
                </Label>
              </div>
              {!equityFormalAgreement && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    It's strongly recommended to formalize equity agreements in writing as soon as possible to avoid disputes later. Consider consulting with a legal professional.
                  </p>
                </div>
              )}
            </div>
          ]
        }
      );
    }
  }

  // Add the original team-status based steps
  if (teamStatus === "solo") {
    steps.push(
      {
        type: "content",
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

  return steps;
};
