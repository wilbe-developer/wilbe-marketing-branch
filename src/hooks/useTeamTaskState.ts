
import { useState, useEffect } from 'react';
import { useSprintProfileQuickEdit } from './useSprintProfileQuickEdit';
import { TeamMember } from './team-members/types';

// If this file doesn't exist yet, we're creating it
export const useTeamTaskState = (task: any, sprintProfile: any) => {
  // Task state
  const [neededSkills, setNeededSkills] = useState<string>('');
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(undefined);
  const [hiringPlanStep, setHiringPlanStep] = useState<'download' | 'upload'>('download');
  
  // New solo founder specific fields
  const [missingSkills, setMissingSkills] = useState<string>('');
  const [skillsJustification, setSkillsJustification] = useState<string>('');
  const [hireProfile, setHireProfile] = useState<string>('');
  const [fullTimeTrigger, setFullTimeTrigger] = useState<string>('');
  
  // Company reasons
  const [companyReasons, setCompanyReasons] = useState<string[]>([]);
  
  // Incorporation data
  const [companyFormationDate, setCompanyFormationDate] = useState<string | undefined>(undefined);
  const [companyFormationLocation, setCompanyFormationLocation] = useState<string | undefined>(undefined);
  const [plannedFormationDate, setPlannedFormationDate] = useState<string | undefined>(undefined);
  const [plannedFormationLocation, setPlannedFormationLocation] = useState<string | undefined>(undefined);
  const [formationLocationReason, setFormationLocationReason] = useState<string | undefined>(undefined);
  
  // Equity data
  const [equityAgreed, setEquityAgreed] = useState<boolean | null>(null);
  const [equitySplit, setEquitySplit] = useState<string>('');
  const [equityConcerns, setEquityConcerns] = useState<string>('');
  
  // Extract from profile for context
  const teamStatus = sprintProfile?.team_status;
  const isIncorporated = sprintProfile?.company_incorporated;
  
  // Load existing answers if available
  useEffect(() => {
    if (task?.progress?.task_answers) {
      const answers = task.progress.task_answers;
      
      // Load basic fields
      if (answers.needed_skills) setNeededSkills(answers.needed_skills);
      if (answers.company_reasons) setCompanyReasons(answers.company_reasons);
      if (answers.file_id) setUploadedFileId(answers.file_id);
      
      // Load solo founder fields
      if (answers.missing_skills) setMissingSkills(answers.missing_skills);
      if (answers.skills_justification) setSkillsJustification(answers.skills_justification);
      if (answers.hire_profile) setHireProfile(answers.hire_profile);
      if (answers.full_time_trigger) setFullTimeTrigger(answers.full_time_trigger);
      
      // Load incorporation data
      if (answers.company_formation_date) setCompanyFormationDate(answers.company_formation_date);
      if (answers.company_formation_location) setCompanyFormationLocation(answers.company_formation_location);
      if (answers.planned_formation_date) setPlannedFormationDate(answers.planned_formation_date);
      if (answers.planned_formation_location) setPlannedFormationLocation(answers.planned_formation_location);
      if (answers.formation_location_reason) setFormationLocationReason(answers.formation_location_reason);
      
      // Load equity data
      if (answers.hasOwnProperty('equity_agreed')) setEquityAgreed(answers.equity_agreed);
      if (answers.equity_split) setEquitySplit(answers.equity_split);
      if (answers.equity_concerns) setEquityConcerns(answers.equity_concerns);
    }
  }, [task]);
  
  return {
    // Basic fields
    neededSkills,
    setNeededSkills,
    uploadedFileId,
    setUploadedFileId,
    hiringPlanStep,
    setHiringPlanStep,
    teamStatus,
    isIncorporated,
    
    // Solo founder fields
    missingSkills,
    setMissingSkills,
    skillsJustification,
    setSkillsJustification,
    hireProfile,
    setHireProfile,
    fullTimeTrigger,
    setFullTimeTrigger,
    
    // Company reasons
    companyReasons,
    setCompanyReasons,
    
    // Incorporation data
    companyFormationDate,
    setCompanyFormationDate,
    companyFormationLocation,
    setCompanyFormationLocation,
    plannedFormationDate,
    setPlannedFormationDate,
    plannedFormationLocation,
    setPlannedFormationLocation,
    formationLocationReason,
    setFormationLocationReason,
    
    // Equity data
    equityAgreed,
    setEquityAgreed,
    equitySplit,
    setEquitySplit,
    equityConcerns,
    setEquityConcerns,
  };
};
