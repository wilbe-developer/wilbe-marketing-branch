
import { useState, useEffect } from 'react';
import { TeamMember } from './types';

export const useTeamMemberState = (taskAnswers: any) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ 
    name: '', 
    profile: '', 
    employmentStatus: '',
    triggerPoints: '' 
  }]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Load team members from taskAnswers when available (this is from sprint progress)
  useEffect(() => {
    if (taskAnswers?.team_members && !initialDataLoaded) {
      console.log("Loading team members from task answers:", taskAnswers.team_members);
      setTeamMembers(taskAnswers.team_members);
      setInitialDataLoaded(true);
    }
  }, [taskAnswers, initialDataLoaded]);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { 
      name: '', 
      profile: '', 
      employmentStatus: '',
      triggerPoints: '' 
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
