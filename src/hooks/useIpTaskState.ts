
import { useState, useEffect } from 'react';

export const useIpTaskState = (task: any) => {
  // Basic data points
  const [reliesOnUniIp, setReliesOnUniIp] = useState<boolean | undefined>(undefined);
  const [ttoConversation, setTtoConversation] = useState<string>('');
  const [ttoTerms, setTtoTerms] = useState<string>('');
  const [ttoPlan, setTtoPlan] = useState<string>('');
  const [ipOwnershipStatus, setIpOwnershipStatus] = useState<string>('');
  const [patentPlans, setPatentPlans] = useState<string>('');
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(undefined);
  
  // Load existing answers if available
  useEffect(() => {
    if (task?.progress?.task_answers) {
      const answers = task.progress.task_answers;
      
      // Load basic fields
      if (answers.relies_on_uni_ip !== undefined) {
        setReliesOnUniIp(answers.relies_on_uni_ip === "yes");
      }
      if (answers.tto_conversation) setTtoConversation(answers.tto_conversation);
      if (answers.tto_terms) setTtoTerms(answers.tto_terms);
      if (answers.tto_plan) setTtoPlan(answers.tto_plan);
      if (answers.ip_ownership_status) setIpOwnershipStatus(answers.ip_ownership_status);
      if (answers.patent_plans) setPatentPlans(answers.patent_plans);
      if (answers.file_id) setUploadedFileId(answers.file_id);
    }
  }, [task]);
  
  return {
    reliesOnUniIp,
    setReliesOnUniIp,
    ttoConversation,
    setTtoConversation,
    ttoTerms,
    setTtoTerms,
    ttoPlan,
    setTtoPlan,
    ipOwnershipStatus,
    setIpOwnershipStatus,
    patentPlans,
    setPatentPlans,
    uploadedFileId,
    setUploadedFileId
  };
};
