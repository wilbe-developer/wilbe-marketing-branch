import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TeamMember } from "@/hooks/team-members/types";
import { TextInputRenderer } from "@/components/sprint/task-builder/dynamic-step/input-renderers/TextInputRenderer";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface TeamMemberFormProps {
  teamMembers: TeamMember[];
  memberType: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TeamMember, value: string) => void;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  teamMembers,
  memberType,
  onAdd,
  onRemove,
  onUpdate,
  autoSaveManager,
  onAutoSaveField,
}) => {
  const isMobile = useIsMobile();

  // Get field labels and placeholders based on member type
  function getFieldConfig(field: keyof TeamMember) {
    if (memberType.toLowerCase() === "co-founder") {
      switch(field) {
        case "relationship_description":
          return {
            label: "Your origin story: How did you meet? How long have you known each other? Have you been through a 'stress project' with each other?",
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
  }

  // Create AutoSave handler for a specific field
  function createAutoSaveHandler(index: number, field: keyof TeamMember) {
    if (!autoSaveManager || !onAutoSaveField) return undefined;
    
    const fieldId = `team_member_${index}_${field}`;
    return async (value: string) => {
      // Update the specific field in the team member
      const updatedMembers = [...teamMembers];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };
      await onAutoSaveField(fieldId, updatedMembers);
    };
  }

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
            {/* Name field - use AutoSave if available */}
            <div className="space-y-1">
              <label htmlFor={`name-${index}`} className="text-sm font-medium">Name</label>
              {autoSaveManager ? (
                <TextInputRenderer
                  id={`team_member_${index}_name`}
                  value={member.name}
                  type="text"
                  placeholder="Name"
                  onChange={(value) => onUpdate(index, 'name', value)}
                  onAutoSave={createAutoSaveHandler(index, 'name')}
                  autoSaveManager={autoSaveManager}
                />
              ) : (
                <Input
                  id={`name-${index}`}
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => onUpdate(index, 'name', e.target.value)}
                  className={isMobile ? "h-9 text-sm" : ""}
                />
              )}
            </div>
            
            {/* Field order for co-founders and team members */}
            {memberType.toLowerCase() === "co-founder" ? (
              <>
                <div className="space-y-1">
                  <label htmlFor={`relationship-${index}`} className="text-sm font-medium">
                    {getFieldConfig("relationship_description").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_relationship_description`}
                      value={member.relationship_description || ''}
                      type="textarea"
                      placeholder={getFieldConfig("relationship_description").placeholder}
                      onChange={(value) => onUpdate(index, 'relationship_description', value)}
                      onAutoSave={createAutoSaveHandler(index, 'relationship_description')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`relationship-${index}`}
                      placeholder={getFieldConfig("relationship_description").placeholder}
                      value={member.relationship_description || ''}
                      onChange={(e) => onUpdate(index, 'relationship_description', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`status-${index}`} className="text-sm font-medium">
                    {getFieldConfig("employment_status").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_employment_status`}
                      value={member.employment_status}
                      type="textarea"
                      placeholder={getFieldConfig("employment_status").placeholder}
                      onChange={(value) => onUpdate(index, 'employment_status', value)}
                      onAutoSave={createAutoSaveHandler(index, 'employment_status')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`status-${index}`}
                      placeholder={getFieldConfig("employment_status").placeholder}
                      value={member.employment_status}
                      onChange={(e) => onUpdate(index, 'employment_status', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`profile-${index}`} className="text-sm font-medium">
                    {getFieldConfig("profile_description").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_profile_description`}
                      value={member.profile_description}
                      type="textarea"
                      placeholder={getFieldConfig("profile_description").placeholder}
                      onChange={(value) => onUpdate(index, 'profile_description', value)}
                      onAutoSave={createAutoSaveHandler(index, 'profile_description')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`profile-${index}`}
                      placeholder={getFieldConfig("profile_description").placeholder}
                      value={member.profile_description}
                      onChange={(e) => onUpdate(index, 'profile_description', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`triggers-${index}`} className="text-sm font-medium">
                    {getFieldConfig("trigger_points").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_trigger_points`}
                      value={member.trigger_points || ''}
                      type="textarea"
                      placeholder={getFieldConfig("trigger_points").placeholder}
                      onChange={(value) => onUpdate(index, 'trigger_points', value)}
                      onAutoSave={createAutoSaveHandler(index, 'trigger_points')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`triggers-${index}`}
                      placeholder={getFieldConfig("trigger_points").placeholder}
                      value={member.trigger_points || ''}
                      onChange={(e) => onUpdate(index, 'trigger_points', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
              </>
            ) : (
              // Keep the original order for regular team members
              <>
                <div className="space-y-1">
                  <label htmlFor={`profile-${index}`} className="text-sm font-medium">
                    {getFieldConfig("profile_description").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_profile_description`}
                      value={member.profile_description}
                      type="textarea"
                      placeholder={getFieldConfig("profile_description").placeholder}
                      onChange={(value) => onUpdate(index, 'profile_description', value)}
                      onAutoSave={createAutoSaveHandler(index, 'profile_description')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`profile-${index}`}
                      placeholder={getFieldConfig("profile_description").placeholder}
                      value={member.profile_description}
                      onChange={(e) => onUpdate(index, 'profile_description', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`relationship-${index}`} className="text-sm font-medium">
                    {getFieldConfig("relationship_description").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_relationship_description`}
                      value={member.relationship_description || ''}
                      type="textarea"
                      placeholder={getFieldConfig("relationship_description").placeholder}
                      onChange={(value) => onUpdate(index, 'relationship_description', value)}
                      onAutoSave={createAutoSaveHandler(index, 'relationship_description')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Textarea
                      id={`relationship-${index}`}
                      placeholder={getFieldConfig("relationship_description").placeholder}
                      value={member.relationship_description || ''}
                      onChange={(e) => onUpdate(index, 'relationship_description', e.target.value)}
                      rows={isMobile ? 3 : 4}
                      className={isMobile ? "text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`status-${index}`} className="text-sm font-medium">
                    {getFieldConfig("employment_status").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_employment_status`}
                      value={member.employment_status}
                      type="text"
                      placeholder={getFieldConfig("employment_status").placeholder}
                      onChange={(value) => onUpdate(index, 'employment_status', value)}
                      onAutoSave={createAutoSaveHandler(index, 'employment_status')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Input
                      id={`status-${index}`}
                      placeholder={getFieldConfig("employment_status").placeholder}
                      value={member.employment_status}
                      onChange={(e) => onUpdate(index, 'employment_status', e.target.value)}
                      className={isMobile ? "h-9 text-sm" : ""}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor={`triggers-${index}`} className="text-sm font-medium">
                    {getFieldConfig("trigger_points").label}
                  </label>
                  {autoSaveManager ? (
                    <TextInputRenderer
                      id={`team_member_${index}_trigger_points`}
                      value={member.trigger_points || ''}
                      type="text"
                      placeholder={getFieldConfig("trigger_points").placeholder}
                      onChange={(value) => onUpdate(index, 'trigger_points', value)}
                      onAutoSave={createAutoSaveHandler(index, 'trigger_points')}
                      autoSaveManager={autoSaveManager}
                    />
                  ) : (
                    <Input
                      id={`triggers-${index}`}
                      placeholder={getFieldConfig("trigger_points").placeholder}
                      value={member.trigger_points || ''}
                      onChange={(e) => onUpdate(index, 'trigger_points', e.target.value)}
                      className={isMobile ? "h-9 text-sm" : ""}
                    />
                  )}
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
