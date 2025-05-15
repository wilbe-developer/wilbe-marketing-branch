
import React, { useState } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";
import IPStepContent from "./ip/IPStepContent";
import { getIPSteps } from "@/hooks/team-step-builder/ip-steps";

interface IPTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  hideMainQuestion?: boolean;
}

const IPTaskLogic: React.FC<IPTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
  hideMainQuestion = false
}) => {
  const { sprintProfile, updateSprintProfile } = useSprintProfileQuickEdit();
  const [currentStep, setCurrentStep] = useState(0);
  
  // State for IP-related data
  const [ttoEngaged, setTtoEngaged] = useState<boolean | undefined>(
    task?.progress?.task_answers?.tto_engaged !== undefined 
      ? Boolean(task?.progress?.task_answers?.tto_engaged) 
      : undefined
  );
  const [ttoConversation, setTtoConversation] = useState<string | undefined>(
    task?.progress?.task_answers?.tto_conversation
  );
  const [ttoTerms, setTtoTerms] = useState<string | undefined>(
    task?.progress?.task_answers?.tto_terms
  );
  const [ttoPlans, setTtoPlans] = useState<string | undefined>(
    task?.progress?.task_answers?.tto_plans
  );
  const [ownAllIP, setOwnAllIP] = useState<boolean | undefined>(
    task?.progress?.task_answers?.own_all_ip !== undefined 
      ? Boolean(task?.progress?.task_answers?.own_all_ip) 
      : undefined
  );
  const [patentsFiled, setPatentsFiled] = useState<boolean | undefined>(
    task?.progress?.task_answers?.patents_filed !== undefined 
      ? Boolean(task?.progress?.task_answers?.patents_filed) 
      : undefined
  );
  const [patentDocuments, setPatentDocuments] = useState<string | undefined>(
    task?.progress?.task_answers?.patent_documents
  );
  const [patentPlans, setPatentPlans] = useState<string | undefined>(
    task?.progress?.task_answers?.patent_plans
  );
  const [ipOwnershipStatus, setIpOwnershipStatus] = useState<string | undefined>(
    task?.progress?.task_answers?.ip_ownership_status
  );

  // Get university_ip from sprint profile
  const universityIP = sprintProfile?.university_ip;

  // Generate steps based on profile and current state
  const ipSteps = getIPSteps(
    universityIP,
    ttoEngaged,
    ttoConversation,
    ttoTerms,
    ttoPlans,
    ownAllIP,
    patentsFiled,
    patentDocuments,
    patentPlans,
    ipOwnershipStatus,
    setTtoEngaged,
    setTtoConversation,
    setTtoTerms,
    setTtoPlans,
    setOwnAllIP,
    setPatentsFiled,
    setPatentDocuments,
    setPatentPlans,
    setIpOwnershipStatus,
    (fileId: string) => setPatentDocuments(fileId)
  );

  const handleStepChange = (stepIndex: number, context?: any) => {
    setCurrentStep(stepIndex);
  };

  const handleComplete = async () => {
    try {
      // Save all IP data
      const taskAnswers = {
        tto_engaged: ttoEngaged,
        tto_conversation: ttoConversation,
        tto_terms: ttoTerms,
        tto_plans: ttoPlans,
        own_all_ip: ownAllIP,
        patents_filed: patentsFiled,
        patent_documents: patentDocuments,
        patent_plans: patentPlans,
        ip_ownership_status: ipOwnershipStatus
      };

      // Call the onComplete callback with the task answers
      await onComplete();
      
      return true;
    } catch (error) {
      console.error("Error in handleComplete for IP task:", error);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <SprintProfileShowOrAsk
        profileKey="university_ip"
        label="Is your company reliant on something you've invented / created at a university?"
        type="boolean"
      >
        {null}
      </SprintProfileShowOrAsk>

      <IPStepContent
        steps={ipSteps}
        isCompleted={isCompleted}
        onComplete={handleComplete}
        onStepChange={handleStepChange}
      />
    </div>
  );
};

export default IPTaskLogic;
