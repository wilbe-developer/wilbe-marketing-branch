
import { useState, useEffect } from 'react';
import { TeamMember } from './types';

export const useTeamMemberState = (taskAnswers: any) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ 
    name: '', 
    profile_description: '', 
    employment_status: '',
    trigger_points: '' 
  }]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Load team members from taskAnswers when available (this is from sprint progress)
  useEffect(() => {
    if (taskAnswers?.team_members && !initialDataLoaded) {
      console.log("Loading team members from task answers:", taskAnswers.team_members);
      
      // Convert from task_answers format to our standardized format if needed
      const members = taskAnswers.team_members.map((member: any) => {
        // Check if the member is using the old format (profile, employmentStatus, triggerPoints)
        if ('profile' in member || 'employmentStatus' in member || 'triggerPoints' in member) {
          return {
            name: member.name,
            profile_description: member.profile || member.profile_description || '',
            employment_status: member.employmentStatus || member.employment_status || '',
            trigger_points: member.triggerPoints || member.trigger_points || ''
          };
        }
        // Already in the correct format
        return member;
      });
      
      setTeamMembers(members);
      setInitialDataLoaded(true);
    }
  }, [taskAnswers, initialDataLoaded]);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { 
      name: '', 
      profile_description: '', 
      employment_status: '',
      trigger_points: '' 
    }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  return {
    teamMembers,
    setTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    initialDataLoaded,
    setInitialDataLoaded
  };
};
