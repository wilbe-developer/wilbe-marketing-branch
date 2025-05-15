
import { useState, useCallback } from 'react';
import { TeamMember } from './team-members/types';

export type { TeamMember } from './team-members/types';

export const useTeamMembers = (savedAnswers?: Record<string, any> | null) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Initialize team members from saved answers if available
  const loadTeamMembers = useCallback(() => {
    if (savedAnswers?.team_members) {
      // Convert from task_answers format to our standardized format if needed
      const members = savedAnswers.team_members.map((member: any) => {
        // Check if the member is using the old format (profile, employmentStatus, triggerPoints)
        if ('profile' in member || 'employmentStatus' in member || 'triggerPoints' in member) {
          return {
            id: member.id || crypto.randomUUID(),
            name: member.name || '',
            profile_description: member.profile || member.profile_description || '',
            employment_status: member.employmentStatus || member.employment_status || '',
            trigger_points: member.triggerPoints || member.trigger_points || '',
            relationship_description: member.relationship_description || ''
          };
        }
        // Already in the correct format
        return {
          id: member.id || crypto.randomUUID(),
          name: member.name || '',
          profile_description: member.profile_description || '',
          employment_status: member.employment_status || '',
          trigger_points: member.trigger_points || '',
          relationship_description: member.relationship_description || ''
        };
      });
      
      setTeamMembers(members);
    } else {
      // Initialize with an empty member if no saved answers
      setTeamMembers([{
        id: crypto.randomUUID(),
        name: '',
        profile_description: '',
        employment_status: '',
        trigger_points: '',
        relationship_description: ''
      }]);
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
