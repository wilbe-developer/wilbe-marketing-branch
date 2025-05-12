
import { useState, useEffect } from 'react';
import { TeamMember } from '@/hooks/useTeamMembers';

export const useTeamTaskState = (task: any, sprintProfile: any) => {
  // Original states
  const [neededSkills, setNeededSkills] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const [hiringPlanStep, setHiringPlanStep] = useState<'download' | 'upload'>('download');
  
  // New states
  const [companyReasons, setCompanyReasons] = useState<string[]>([]);
  const [equitySplit, setEquitySplit] = useState<string>('');
  const [equityRationale, setEquityRationale] = useState<string>('');
  const [vestingSchedule, setVestingSchedule] = useState<boolean>(false);
  const [vestingDetails, setVestingDetails] = useState<string>('');
  const [equityFormalAgreement, setEquityFormalAgreement] = useState<boolean>(false);
  
  // Extract values from profile
  const teamStatus = sprintProfile?.team_status;
  const isIncorporated = sprintProfile?.company_incorporated || false;

  // Load needed skills from task answers if available
  useEffect(() => {
    if (task?.progress?.task_answers) {
      const answers = task.progress.task_answers;
      
      if (answers.needed_skills) {
        setNeededSkills(answers.needed_skills);
      }
      
      if (answers.company_reasons) {
        setCompanyReasons(answers.company_reasons);
      }
      
      if (answers.equity_split) {
        setEquitySplit(answers.equity_split);
      }
      
      if (answers.equity_rationale) {
        setEquityRationale(answers.equity_rationale);
      }
      
      if (answers.vesting_schedule !== undefined) {
        setVestingSchedule(answers.vesting_schedule);
      }
      
      if (answers.vesting_details) {
        setVestingDetails(answers.vesting_details);
      }
      
      if (answers.equity_formal_agreement !== undefined) {
        setEquityFormalAgreement(answers.equity_formal_agreement);
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
    // New returns
    isIncorporated,
    companyReasons,
    setCompanyReasons,
    equitySplit,
    setEquitySplit,
    equityRationale,
    setEquityRationale,
    vestingSchedule,
    setVestingSchedule,
    vestingDetails,
    setVestingDetails,
    equityFormalAgreement,
    setEquityFormalAgreement,
  };
};
