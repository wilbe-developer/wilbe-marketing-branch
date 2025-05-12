
import { useEffect } from "react";
import { useTeamMemberState } from "./team-members/useTeamMemberState";
import { useTeamMemberDatabase } from "./team-members/useTeamMemberDatabase";
import { serializeTeamMembers, TeamMember } from "./team-members/types";

export type { TeamMember } from "./team-members/types";
export { serializeTeamMembers } from "./team-members/types";

export const useTeamMembers = (taskAnswers: any) => {
  const {
    teamMembers,
    setTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    initialDataLoaded,
    setInitialDataLoaded
  } = useTeamMemberState(taskAnswers);

  const {
    loading,
    loadTeamMembers,
    saveTeamMembers
  } = useTeamMemberDatabase(
    teamMembers,
    setTeamMembers,
    initialDataLoaded,
    setInitialDataLoaded
  );

  // Initial load from team_members table
  useEffect(() => {
    if (!initialDataLoaded) {
      loadTeamMembers(taskAnswers);
    }
  }, [initialDataLoaded, loadTeamMembers, taskAnswers]);

  return {
    teamMembers,
    loading,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    saveTeamMembers,
    loadTeamMembers,
    serializeTeamMembers
  };
};
