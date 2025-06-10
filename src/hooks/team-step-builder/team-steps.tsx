import React from "react";
import { EnhancedStep } from "./types";
import { TeamMember } from "../team-members/types";
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
  missingSkills: string,
  skillsJustification: string,
  hireProfile: string,
  fullTimeTrigger: string,
  onTeamMemberAdd: () => void,
  onTeamMemberRemove: (index: number) => void,
  onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string, isTyping?: boolean) => void,
  onSkillsChange: (skills: string) => void,
  onMissingSkillsChange: (skills: string) => void,
  onSkillsJustificationChange: (text: string) => void,
  onHireProfileChange: (text: string) => void,
  onFullTimeTriggerChange: (text: string) => void,
  onFileUpload: (fileId: string) => void,
  onHiringPlanStepChange: (step: 'download' | 'upload') => void,
  getTeamMemberFieldStatus?: (index: number, field: keyof TeamMember) => any
): EnhancedStep[] => {
  if (teamStatus === undefined) {
    return [];
  }
  
  // Start with an empty array of steps instead of having an empty first step
  const steps: EnhancedStep[] = [];
  
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
          "What professional skills do you currently possess that will help you build this company?",
          <div key="skills-input" className="mt-4">
            <Textarea 
              value={neededSkills}
              onChange={(e) => onSkillsChange(e.target.value)}
              placeholder="Example: Product management, marketing experience, technical expertise in AI..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      },
      {
        type: "content",
        context: "team",
        content: [
          "What critical skills are you missing that you'll need to build this company?",
          <div key="missing-skills-input" className="mt-4">
            <Textarea 
              value={missingSkills}
              onChange={(e) => onMissingSkillsChange(e.target.value)}
              placeholder="Example: Technical co-founder with expertise in AI, Marketing professional with B2B SaaS experience..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      },
      {
        type: "content",
        context: "team",
        content: [
          "Why do you believe these missing skills are critical to your success?",
          <div key="justification-input" className="mt-4">
            <Textarea 
              value={skillsJustification}
              onChange={(e) => onSkillsJustificationChange(e.target.value)}
              placeholder="Explain how these missing skills are essential for your business model and growth..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      },
      {
        type: "content",
        context: "team",
        content: [
          "What would the profile of your ideal first hire or co-founder look like?",
          <div key="hire-profile-input" className="mt-4">
            <Textarea 
              value={hireProfile}
              onChange={(e) => onHireProfileChange(e.target.value)}
              placeholder="Describe the background, experience, and qualities you'd look for..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      },
      {
        type: "content",
        context: "team",
        content: [
          "What key milestone or trigger point would signal it's time to bring them on full-time?",
          <div key="trigger-point-input" className="mt-4">
            <Textarea 
              value={fullTimeTrigger}
              onChange={(e) => onFullTimeTriggerChange(e.target.value)}
              placeholder="Example: Securing seed funding, reaching X paying customers, validated MVP..."
              rows={4}
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
            getFieldStatus={getTeamMemberFieldStatus}
          />
        ]
      }
    );
  }
  
  return steps;
};
