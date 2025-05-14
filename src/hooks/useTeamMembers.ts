
import { useState, useCallback } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  profile_description: string;
  employment_status: 'cofounder' | 'employee' | 'advisor' | 'other';
  trigger_points?: string | null;
}

export const useTeamMembers = (savedAnswers?: Record<string, any> | null) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Initialize team members from saved answers if available
  const loadTeamMembers = useCallback(() => {
    if (savedAnswers?.team_members) {
      setTeamMembers(savedAnswers.team_members);
    }
  }, [savedAnswers]);

  // Add a new team member
  const addTeamMember = (newMember: Omit<TeamMember, 'id'>) => {
    const memberWithId: TeamMember = {
      ...newMember,
      id: crypto.randomUUID()
    };
    
    setTeamMembers(prev => [...prev, memberWithId]);
    
    return memberWithId;
  };

  // Remove a team member by ID
  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  // Update an existing team member
  const updateTeamMember = (id: string, updatedData: Partial<TeamMember>) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id 
          ? { ...member, ...updatedData } 
          : member
      )
    );
  };

  // Save team members data (to be implemented based on context)
  const saveTeamMembers = async () => {
    // Implementation will be provided by the parent component using a callback
    return true;
  };

  return {
    teamMembers,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    saveTeamMembers,
    loadTeamMembers
  };
};
