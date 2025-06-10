
import React, { useState, useEffect } from "react";
import { StepNode } from "@/types/task-builder";
import TeamMemberForm from "@/components/sprint/step-types/TeamMemberForm";
import { TeamMember } from "@/hooks/team-members/types";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface TeamMemberStepRendererProps {
  step: StepNode;
  answer: TeamMember[] | null;
  onAnswer: (value: TeamMember[]) => void;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
  };
  onAutoSaveField?: (fieldId: string, value: any) => Promise<void>;
}

export const TeamMemberStepRenderer: React.FC<TeamMemberStepRendererProps> = ({
  step,
  answer,
  onAnswer,
  autoSaveManager,
  onAutoSaveField,
}) => {
  // Initialize with empty array if no answer, or ensure answer is array
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    Array.isArray(answer) ? answer : [
      {
        id: crypto.randomUUID(),
        name: "",
        profile_description: "",
        employment_status: "",
        trigger_points: "",
        relationship_description: "",
      }
    ]
  );

  // When answer changes from parent, update local state
  useEffect(() => {
    if (Array.isArray(answer) && answer.length > 0) {
      setTeamMembers(answer);
    }
  }, [answer]);

  // Add a new team member - immediate save
  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: "",
      profile_description: "",
      employment_status: "",
      trigger_points: "",
      relationship_description: "",
    };
    
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    onAnswer(updatedMembers);
  };

  // Remove a team member - immediate save
  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
    onAnswer(updatedMembers);
  };

  // Update a team member field with AutoSave
  const handleUpdateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setTeamMembers(updatedMembers);
    
    // Create unique field ID for this specific field
    const fieldId = `team_member_${index}_${field}`;
    
    // Use AutoSave if available, otherwise immediate save
    if (autoSaveManager && onAutoSaveField) {
      autoSaveManager.handleFieldChange(fieldId, updatedMembers, true, async (newMembers) => {
        await onAutoSaveField(step.id, newMembers);
      });
    } else {
      onAnswer(updatedMembers);
    }
  };

  return (
    <TeamMemberForm
      teamMembers={teamMembers}
      memberType={step.memberType || "Co-founder"} // Default to "Co-founder" if not specified
      onAdd={handleAddMember}
      onRemove={handleRemoveMember}
      onUpdate={handleUpdateMember}
      autoSaveManager={autoSaveManager}
      onAutoSaveField={onAutoSaveField}
    />
  );
};
