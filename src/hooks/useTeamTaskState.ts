
import { useState, useEffect } from 'react';
import { TeamMember } from '@/hooks/useTeamMembers';

export const useTeamTaskState = (task: any, sprintProfile: any) => {
  // Original states
  const [neededSkills, setNeededSkills] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const [hiringPlanStep, setHiringPlanStep] = useState<'download' | 'upload'>('download');
  
  // Company reasons state
  const [companyReasons, setCompanyReasons] = useState<string[]>([]);
  
  // Incorporation related states
  const [companyFormationDate, setCompanyFormationDate] = useState<string>('');
  const [companyFormationLocation, setCompanyFormationLocation] = useState<string>('');
  const [plannedFormationDate, setPlannedFormationDate] = useState<string>('');
  const [plannedFormationLocation, setPlannedFormationLocation] = useState<string>('');
  const [formationLocationReason, setFormationLocationReason] = useState<string>('');
  
  // Equity related states
  const [equityAgreed, setEquityAgreed] = useState<boolean | null>(null);
  const [equitySplit, setEquitySplit] = useState<string>('');
  const [equityConcerns, setEquityConcerns] = useState<string>('');
  
  // Extract values from profile
  const teamStatus = sprintProfile?.team_status;
  const isIncorporated = sprintProfile?.company_incorporated || false;

  // Load saved answers if available
  useEffect(() => {
    if (task?.progress?.task_answers) {
      const answers = task.progress.task_answers;
      
      // Original answers
      if (answers.needed_skills) {
        setNeededSkills(answers.needed_skills);
      }
      
      // Company reasons
      if (answers.company_reasons) {
        setCompanyReasons(answers.company_reasons);
      }
      
      // Incorporation data
      if (answers.company_formation_date) {
        setCompanyFormationDate(answers.company_formation_date);
      }
      
      if (answers.company_formation_location) {
        setCompanyFormationLocation(answers.company_formation_location);
      }
      
      if (answers.planned_formation_date) {
        setPlannedFormationDate(answers.planned_formation_date);
      }
      
      if (answers.planned_formation_location) {
        setPlannedFormationLocation(answers.planned_formation_location);
      }
      
      if (answers.formation_location_reason) {
        setFormationLocationReason(answers.formation_location_reason);
      }
      
      // Equity data
      if (answers.equity_agreed !== undefined) {
        setEquityAgreed(answers.equity_agreed);
      }
      
      if (answers.equity_split) {
        setEquitySplit(answers.equity_split);
      }
      
      if (answers.equity_concerns) {
        setEquityConcerns(answers.equity_concerns);
      }
    }
  }, [task?.progress?.task_answers]);

  // Load uploaded file ID if available
  useEffect(() => {
    if (task?.progress?.file_id) {
      setUploadedFileId(task.progress.file_id);
    }
  }, [task?.progress?.file_id]);

  return {
    // Original returns
    neededSkills,
    setNeededSkills,
    uploadedFileId,
    setUploadedFileId,
    hiringPlanStep,
    setHiringPlanStep,
    teamStatus,
    isIncorporated,
    
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
