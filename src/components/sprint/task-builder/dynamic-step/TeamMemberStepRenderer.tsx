
import React, { useState, useEffect } from "react";
import { StepNode } from "@/types/task-builder";
import TeamMemberForm from "@/components/sprint/step-types/TeamMemberForm";
import { TeamMember } from "@/hooks/team-members/types";

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

  // Add a new team member
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

  // Remove a team member
  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
    onAnswer(updatedMembers);
  };

  // Update a team member
  const handleUpdateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    setTeamMembers(updatedMembers);
    onAnswer(updatedMembers);
  };

  return (
    <TeamMemberForm
      teamMembers={teamMembers}
      memberType={step.memberType || "Co-founder"} // Default to "Co-founder" if not specified
      onAdd={handleAddMember}
      onRemove={handleRemoveMember}
      onUpdate={handleUpdateMember}
    />
  );
};
