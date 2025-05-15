
import { useState, useCallback } from 'react';
import { useIPTaskState } from './useIPTaskState';
import { useIPTaskSave } from './useIPTaskSave';
import { getIPSteps } from './team-step-builder/ip-steps';
import { IPStepContext } from './team-step-builder/ip-types';

export const useIPTaskData = (task: any, sprintProfile: any) => {
  const {
    ttoConversationSummary, setTtoConversationSummary,
    preliminaryTerms, setPreliminaryTerms,
    ttoEngagementPlans, setTtoEngagementPlans,
    patentsFilingPlans, setPatentsFilingPlans,
    ipOwnershipStatus, setIpOwnershipStatus,
    patentsFiled, setPatentsFiled,
    uploadedFileId, setUploadedFileId,
    universityIP, ttoEngaged
  } = useIPTaskState(task, sprintProfile);
  
  const { saveIPTaskData } = useIPTaskSave(task.id);
  
  const [currentStepContext, setCurrentStepContext] = useState<IPStepContext | undefined>(undefined);
  
  // Update form fields
  const handleFormDataChange = useCallback((field: string, value: string) => {
    switch (field) {
      case 'ttoConversationSummary':
        setTtoConversationSummary(value);
        break;
      case 'preliminaryTerms':
        setPreliminaryTerms(value);
        break;
      case 'ttoEngagementPlans':
        setTtoEngagementPlans(value);
        break;
      case 'patentsFilingPlans':
        setPatentsFilingPlans(value);
        break;
      case 'ipOwnershipStatus':
        setIpOwnershipStatus(value);
        break;
      default:
        break;
    }
  }, [setTtoConversationSummary, setPreliminaryTerms, setTtoEngagementPlans, setPatentsFilingPlans, setIpOwnershipStatus]);
  
  // Generate steps based on current state
  const steps = getIPSteps(
    universityIP,
    ttoEngaged,
    {
      ttoConversationSummary,
      preliminaryTerms,
      ttoEngagementPlans,
      patentsFilingPlans,
      ipOwnershipStatus
    },
    patentsFiled,
    uploadedFileId,
    handleFormDataChange,
    setPatentsFiled,
    setUploadedFileId
  );
  
  const handleStepChange = useCallback((stepIndex: number, context?: any) => {
    const newContext = context?.type as IPStepContext;
    setCurrentStepContext(newContext);
  }, []);
  
  const handleComplete = useCallback(async () => {
    try {
      // Prepare data for saving
      const dataToSave = {
        tto_conversation_summary: ttoConversationSummary,
        preliminary_terms: preliminaryTerms,
        tto_engagement_plans: ttoEngagementPlans,
        patents_filing_plans: patentsFilingPlans,
        ip_ownership_status: ipOwnershipStatus,
        patents_filed: patentsFiled,
        file_id: uploadedFileId
      };
      
      await saveIPTaskData.mutateAsync(dataToSave);
      return true;
    } catch (error) {
      console.error("Error completing IP task:", error);
      return false;
    }
  }, [
    ttoConversationSummary, preliminaryTerms, ttoEngagementPlans,
    patentsFilingPlans, ipOwnershipStatus, patentsFiled,
    uploadedFileId, saveIPTaskData
  ]);
  
  return {
    steps,
    currentStepContext,
    handleStepChange,
    handleComplete,
    universityIP,
    ttoEngaged,
    patentsFiled,
    uploadedFileId
  };
};
