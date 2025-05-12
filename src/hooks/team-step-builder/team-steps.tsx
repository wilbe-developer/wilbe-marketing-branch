
import React from "react";
import { EnhancedStep } from "./types";
import { TeamMember } from "../useTeamMembers";
import VideoEmbed from "@/components/video-player/VideoEmbed";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUploader from "@/components/sprint/FileUploader";
import UploadedFileView from "@/components/sprint/UploadedFileView";
import TeamMemberForm from "@/components/sprint/step-types/TeamMemberForm";

const TEAM_BUILDING_VIDEO_ID = "j5TEYCrLDYo";
const HIRING_TEMPLATE_PLACEHOLDER = "/hiring-template-placeholder.pdf";

export const getTeamSteps = (
  teamStatus: string | undefined,
  teamMembers: TeamMember[],
  neededSkills: string,
  uploadedFileId: string | undefined,
  hiringPlanStep: 'download' | 'upload',
  onTeamMemberAdd: () => void,
  onTeamMemberRemove: (index: number) => void,
  onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string) => void,
  onSkillsChange: (skills: string) => void,
  onFileUpload: (fileId: string) => void,
  onHiringPlanStepChange: (step: 'download' | 'upload') => void
): EnhancedStep[] => {
  if (teamStatus === undefined) {
    return [];
  }
  
  // Start with the profile information step
  const steps: EnhancedStep[] = [
    {
      type: "content",
      context: "team",
      content: [
        <div key="team-status-info" className="mt-1">{null}</div>
      ]
    }
  ];
  
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
  
  return steps;
};
