
import { useState } from "react";
import { useIpTaskState } from "./useIpTaskState";
import { getIpSteps } from "./ip-step-builder/ip-steps";
import { useIpTaskSave } from "./useIpTaskSave";
import { IpStepContext } from "./ip-step-builder/types";
import { toast } from "sonner";

export const useIpTaskData = (task: any) => {
  const {
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
  } = useIpTaskState(task);

  const { saveIpTaskData } = useIpTaskSave();
  const [currentStepContext, setCurrentStepContext] = useState<IpStepContext | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate the steps
  const steps = getIpSteps(
    reliesOnUniIp,
    ttoConversation,
    ttoTerms,
    ttoPlan,
    ipOwnershipStatus,
    patentPlans,
    uploadedFileId,
    setTtoConversation,
    setTtoTerms,
    setTtoPlan,
    setIpOwnershipStatus,
    setPatentPlans,
    setUploadedFileId
  );

  // Define the conditional flow based on user responses
  const conditionalFlow = {
    0: { // check_reliance step
      "yes": 1, // go to uni_ip_path
      "no": 4,  // go to non_uni_ip_path
    }
  };

  // If reliesOnUniIp is true, add TTO conversation paths
  if (reliesOnUniIp === true) {
    conditionalFlow[1] = { // uni_ip_path step
      "yes": 2, // go to TTO conversation details
      "no": 3,  // go to TTO plan
    };
  } 
  // If reliesOnUniIp is false, add ownership and patent paths
  else if (reliesOnUniIp === false) {
    conditionalFlow[4] = { // non_uni_ip_path step
      "yes": 6, // go to patents_filed
      "no": 5,  // go to IP ownership explanation
    };
    conditionalFlow[6] = { // patents_filed step
      "yes": 7, // go to patent upload
      "no": 8,  // go to patent plans
    };
  }

  // Handle step changes to control the flow
  const handleStepChange = (stepIndex: number, context?: IpStepContext) => {
    setCurrentStepContext(context);
    
    // If we're on the first step and an answer is selected, set reliesOnUniIp accordingly
    if (stepIndex === 0 && context?.data === "yes") {
      setReliesOnUniIp(true);
    } else if (stepIndex === 0 && context?.data === "no") {
      setReliesOnUniIp(false);
    }
  };

  // Handle completion of the IP task
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Validate inputs based on flow
      if (reliesOnUniIp === undefined) {
        toast.error("Please indicate if the company relies on university IP");
        setIsLoading(false);
        return false;
      }
      
      // Save all IP task data
      const success = await saveIpTaskData(
        task.id,
        reliesOnUniIp,
        ttoConversation,
        ttoTerms,
        ttoPlan,
        ipOwnershipStatus,
        patentPlans,
        uploadedFileId
      );

      return success;
    } catch (error) {
      console.error("Error in handleComplete:", error);
      toast.error("Failed to save your progress");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    steps,
    conditionalFlow,
    currentStepContext,
    handleStepChange,
    handleComplete,
    reliesOnUniIp,
    uploadedFileId,
    isLoading
  };
};
