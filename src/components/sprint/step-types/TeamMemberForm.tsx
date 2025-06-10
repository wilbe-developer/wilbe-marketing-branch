
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TeamMember } from "@/hooks/team-members/types";
import { TeamMemberSaveStatus } from "@/hooks/useTeamMemberAutoSave";

interface TeamMemberFormProps {
  teamMembers: TeamMember[];
  memberType: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TeamMember, value: string, isTyping?: boolean) => void;
  getFieldStatus?: (index: number, field: keyof TeamMember) => TeamMemberSaveStatus;
  startTyping?: (index: number, field: keyof TeamMember) => void;
  stopTyping?: (index: number, field: keyof TeamMember) => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  teamMembers,
  memberType,
  onAdd,
  onRemove,
  onUpdate,
  getFieldStatus,
  startTyping,
  stopTyping,
}) => {
  const isMobile = useIsMobile();

  // Get field labels and placeholders based on member type
  const getFieldConfig = (field: keyof TeamMember) => {
    if (memberType.toLowerCase() === "co-founder") {
      switch(field) {
        case "relationship_description":
          return {
            label: "Your origin story: How did you meet? How long have you known each other? Have you been through a "stress project" with each other?",
            placeholder: "Describe your relationship and how long you've known each other"
          };
        case "employment_status":
          return {
            label: "What will this co-founder be responsible for?",
            placeholder: "Describe their role in the company"
          };
        case "profile_description":
          return {
            label: "Why are they the best person for this job? Who would be better if you could pick?",
            placeholder: "Describe their personal and professional strengths that make them the best fit"
          };
        case "trigger_points":
          return {
            label: "If they are not full-time, what will trigger them to be full-time and why? Be specific and detailed. If it's money, make the case as to why a certain amount would be enough. If it's something else, please explain in detail.",
            placeholder: "E.g., Securing funding, reaching X paying customers, etc."
          };
        default:
          return {
            label: "Name",
            placeholder: "Name"
          };
      }
    } else {
      // Default labels for team members
      switch(field) {
        case "relationship_description":
          return {
            label: "Describe this team member: How did you meet? How long have you known each other?",
            placeholder: "Describe your relationship and how long you've known each other"
          };
        case "employment_status":
          return {
            label: "What will this team member be responsible for?",
            placeholder: "Describe their role in the company"
          };
        case "trigger_points":
          return {
            label: "If they are not full-time, what will trigger them to be full-time and why? Be specific and detailed. If it's money, make the case as to why a certain amount would be enough. If it's something else, please explain in detail.",
            placeholder: "Trigger points for going full-time"
          };
        case "profile_description":
          return {
            label: "Why are they the best person for this job? Who would be better if you could pick?",
            placeholder: "Describe their personal and professional strengths that make them the best fit"
          };
        default:
          return {
            label: "Name",
            placeholder: "Name"
          };
      }
    }
  };

  // Helper to get status indicator
  const getStatusIndicator = (status: TeamMemberSaveStatus) => {
    switch (status) {
      case 'typing':
        return <span className="text-xs text-gray-500">typing...</span>;
      case 'saving':
        return <span className="text-xs text-blue-500">saving...</span>;
      case 'saved':
        return <span className="text-xs text-green-500">saved</span>;
      case 'error':
        return <span className="text-xs text-red-500">error</span>;
      default:
        return null;
    }
  };

  // Create input handlers with explicit typing control
  const createInputHandlers = (index: number, field: keyof TeamMember) => ({
    onFocus: () => startTyping?.(index, field),
    onBlur: () => stopTyping?.(index, field),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      onUpdate(index, field, e.target.value, true)
  });

  return (
    <div className="space-y-4">
      {memberType.toLowerCase() === "co-founder" && (
        <p className="text-gray-700 mb-4">Provide a detailed profile of each co-founder</p>
      )}
      
      {teamMembers.map((member, index) => (
        <div key={index} className={`space-y-3 border rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="flex justify-between items-center">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>{`${memberType} ${index + 1}`}</h3>
            {index > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className={isMobile ? "h-8 w-8 p-0" : ""}
              >
                <Trash2 className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor={`name-${index}`} className="text-sm font-medium">Name</label>
                {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'name'))}
              </div>
              <Input
                id={`name-${index}`}
                placeholder="Name"
                value={member.name}
                {...createInputHandlers(index, 'name')}
                className={isMobile ? "h-9 text-sm" : ""}
              />
            </div>
            
            {memberType.toLowerCase() === "co-founder" ? (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`relationship-${index}`} className="text-sm font-medium">
                      {getFieldConfig("relationship_description").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'relationship_description'))}
                  </div>
                  <Textarea
                    id={`relationship-${index}`}
                    placeholder={getFieldConfig("relationship_description").placeholder}
                    value={member.relationship_description || ''}
                    {...createInputHandlers(index, 'relationship_description')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`status-${index}`} className="text-sm font-medium">
                      {getFieldConfig("employment_status").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'employment_status'))}
                  </div>
                  <Textarea
                    id={`status-${index}`}
                    placeholder={getFieldConfig("employment_status").placeholder}
                    value={member.employment_status}
                    {...createInputHandlers(index, 'employment_status')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`profile-${index}`} className="text-sm font-medium">
                      {getFieldConfig("profile_description").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'profile_description'))}
                  </div>
                  <Textarea
                    id={`profile-${index}`}
                    placeholder={getFieldConfig("profile_description").placeholder}
                    value={member.profile_description}
                    {...createInputHandlers(index, 'profile_description')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`triggers-${index}`} className="text-sm font-medium">
                      {getFieldConfig("trigger_points").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'trigger_points'))}
                  </div>
                  <Textarea
                    id={`triggers-${index}`}
                    placeholder={getFieldConfig("trigger_points").placeholder}
                    value={member.trigger_points || ''}
                    {...createInputHandlers(index, 'trigger_points')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
              </>
            ) : (
              // Keep the original order for regular team members
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`profile-${index}`} className="text-sm font-medium">
                      {getFieldConfig("profile_description").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'profile_description'))}
                  </div>
                  <Textarea
                    id={`profile-${index}`}
                    placeholder={getFieldConfig("profile_description").placeholder}
                    value={member.profile_description}
                    {...createInputHandlers(index, 'profile_description')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`relationship-${index}`} className="text-sm font-medium">
                      {getFieldConfig("relationship_description").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'relationship_description'))}
                  </div>
                  <Textarea
                    id={`relationship-${index}`}
                    placeholder={getFieldConfig("relationship_description").placeholder}
                    value={member.relationship_description || ''}
                    {...createInputHandlers(index, 'relationship_description')}
                    rows={isMobile ? 3 : 4}
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`status-${index}`} className="text-sm font-medium">
                      {getFieldConfig("employment_status").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'employment_status'))}
                  </div>
                  <Input
                    id={`status-${index}`}
                    placeholder={getFieldConfig("employment_status").placeholder}
                    value={member.employment_status}
                    {...createInputHandlers(index, 'employment_status')}
                    className={isMobile ? "h-9 text-sm" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`triggers-${index}`} className="text-sm font-medium">
                      {getFieldConfig("trigger_points").label}
                    </label>
                    {getFieldStatus && getStatusIndicator(getFieldStatus(index, 'trigger_points'))}
                  </div>
                  <Input
                    id={`triggers-${index}`}
                    placeholder={getFieldConfig("trigger_points").placeholder}
                    value={member.trigger_points || ''}
                    {...createInputHandlers(index, 'trigger_points')}
                    className={isMobile ? "h-9 text-sm" : ""}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full"
        size={isMobile ? "sm" : "default"}
      >
        Add Another {memberType}
      </Button>
    </div>
  );
};

export default TeamMemberForm;
