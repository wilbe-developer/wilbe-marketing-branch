
import { useState, useEffect } from 'react';

export const useIPTaskState = (task: any, sprintProfile: any) => {
  // Form data state
  const [ttoConversationSummary, setTtoConversationSummary] = useState<string>('');
  const [preliminaryTerms, setPreliminaryTerms] = useState<string>('');
  const [ttoEngagementPlans, setTtoEngagementPlans] = useState<string>('');
  const [patentsFilingPlans, setPatentsFilingPlans] = useState<string>('');
  const [ipOwnershipStatus, setIpOwnershipStatus] = useState<string>('');
  
  // Patent filed state and file upload
  const [patentsFiled, setPatentsFiled] = useState<boolean | undefined>(undefined);
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(undefined);
  
  // Extract from profile for context
  const universityIP = sprintProfile?.university_ip;
  const ttoEngaged = sprintProfile?.tto_engaged;
  
  // Load existing answers if available
  useEffect(() => {
    if (task?.progress?.task_answers) {
      const answers = task.progress.task_answers;
      
      // Load text data
      if (answers.tto_conversation_summary) setTtoConversationSummary(answers.tto_conversation_summary);
      if (answers.preliminary_terms) setPreliminaryTerms(answers.preliminary_terms);
      if (answers.tto_engagement_plans) setTtoEngagementPlans(answers.tto_engagement_plans);
      if (answers.patents_filing_plans) setPatentsFilingPlans(answers.patents_filing_plans);
      if (answers.ip_ownership_status) setIpOwnershipStatus(answers.ip_ownership_status);
      
      // Load boolean and file data
      if (answers.hasOwnProperty('patents_filed')) setPatentsFiled(answers.patents_filed);
      if (answers.file_id) setUploadedFileId(answers.file_id);
    }
  }, [task]);
  
  return {
    // Form data
    ttoConversationSummary,
    setTtoConversationSummary,
    preliminaryTerms,
    setPreliminaryTerms,
    ttoEngagementPlans,
    setTtoEngagementPlans,
    patentsFilingPlans,
    setPatentsFilingPlans,
    ipOwnershipStatus,
    setIpOwnershipStatus,
    
    // Patent status and file
    patentsFiled,
    setPatentsFiled,
    uploadedFileId,
    setUploadedFileId,
    
    // Profile data
    universityIP,
    ttoEngaged
  };
};
