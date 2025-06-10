
import React, { useEffect } from "react";
import { StepNode } from "@/types/task-builder";
import TeamMemberForm from "@/components/sprint/step-types/TeamMemberForm";
import { TeamMember } from "@/hooks/team-members/types";
import { useTeamMemberAutoSave } from "@/hooks/useTeamMemberAutoSave";

interface TeamMemberStepRendererProps {
  step: StepNode;
  answer: TeamMember[] | null;
  onAnswer: (value: TeamMember[]) => void;
}

export const TeamMemberStepRenderer: React.FC<TeamMemberStepRendererProps> = ({
  step,
  answer,
  onAnswer,
}) => {
  // Initialize with empty array if no answer, or ensure answer is array
  const initialMembers = Array.isArray(answer) ? answer : [
    {
      id: crypto.randomUUID(),
      name: "",
      profile_description: "",
      employment_status: "",
      trigger_points: "",
      relationship_description: "",
    }
  ];

  const {
    members,
    handleFieldChange,
    handleAddMember,
    handleRemoveMember,
    getFieldStatus,
    forceSaveAll,
    startTyping,
    stopTyping
  } = useTeamMemberAutoSave({
    initialMembers,
    onSave: async (updatedMembers: TeamMember[]) => {
      onAnswer(updatedMembers);
    },
    debounceMs: 2000
  });

  // Update members when answer changes from parent
  useEffect(() => {
    if (Array.isArray(answer) && answer.length > 0) {
      // Only update if the answer is actually different
      const answersMatch = JSON.stringify(answer) === JSON.stringify(members);
      if (!answersMatch) {
        // Force save any pending changes before updating
        forceSaveAll();
      }
    }
  }, [answer, members, forceSaveAll]);

  return (
    <TeamMemberForm
      teamMembers={members}
      memberType={step.memberType || "Co-founder"}
      onAdd={handleAddMember}
      onRemove={handleRemoveMember}
      onUpdate={handleFieldChange}
      getFieldStatus={getFieldStatus}
      startTyping={startTyping}
      stopTyping={stopTyping}
    />
  );
};
