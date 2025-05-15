
import React, { useState } from "react";
import { toast } from "sonner";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import StepBasedTaskLogic, { Step } from "../StepBasedTaskLogic";
import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants/app";

interface IpDetailedTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  hideMainQuestion?: boolean;
}

const IpDetailedTaskLogic: React.FC<IpDetailedTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
  hideMainQuestion = false,
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const [isWorking, setIsWorking] = useState(false);
  
  // Define the conditional flow based on user responses
  const conditionalFlow = {
    0: { // check_reliance step
      "yes": 1, // go to uni_ip_path
      "no": 3,  // go to non_uni_ip_path
    },
    1: { // uni_ip_path step
      "yes": 2, // go to tto conversation details
      "no": 5,  // go to content_general after TTO plans
    },
    3: { // non_uni_ip_path step
      "yes": 6, // go to patents_filed
      "no": 5,  // go to content_general after IP ownership explanation
    },
    6: { // patents_filed step
      "yes": 8, // go to patent upload
      "no": 5,  // go to content_general after patent plans
    },
  };

  // Define the steps based on the specification
  const steps: Step[] = [
    // Step 0: check_reliance
    {
      type: "question",
      question: "Is the company reliant on IP created at a university?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      context: "company"
    },
    
    // Step 1: uni_ip_path
    {
      type: "question",
      question: "Have you begun conversations with the Tech Transfer Office (TTO)?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ]
    },
    
    // Step 2: TTO conversation details (for yes path)
    {
      type: "question",
      question: "Summarize the conversation with the TTO.",
      content: [
        "Please provide the following information:",
        "List the preliminary licensing terms (especially % equity) the TTO expects. Include anything agreed or merely mentioned."
      ]
    },
    
    // Step 3: non_uni_ip_path
    {
      type: "question",
      question: "Do you own all the IP?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ]
    },
    
    // Step 4: IP ownership explanation (for no path)
    {
      type: "question",
      question: "Explain the current status of IP ownership.",
    },
    
    // Step 5: content_general
    {
      type: "content",
      content: [
        "Content to cover for everyone",
        "You are the core asset of the company.",
        "Role of inventions and why protecting them is crucial.",
        "Why this IP is relevant to your business strategy.",
        "Raising funding without foundational IP: risks & challenges.",
        "How to define an IP strategy that matches market validation."
      ]
    },
    
    // Step 6: patents_filed
    {
      type: "question",
      question: "Have patents been filed?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ]
    },
    
    // Step 7: Patent plans explanation (for no path)
    {
      type: "question",
      question: "Explain your plans for filing patents.",
    },
    
    // Step 8: Patent upload (for yes path)
    {
      type: "upload",
      content: "Upload your patent documents",
      uploads: ["Patent documents"]
    },
    
    // Step 9: content_uni_specific (only shown for university IP path)
    {
      type: "content",
      content: [
        "Deep-dive for uni-created IP",
        "What is a Tech Transfer Office (TTO)?",
        "How do they think and evaluate inventions?",
        "Do you actually own your IP—what does your license say?",
        "When and how should you approach them?",
        "Switching from an employee mindset to founder of an independent company.",
        "Why nobody else (lawyers, investors, advisors) can negotiate on your behalf.",
        "Why this is the best opportunity to evolve as a founder.",
        "The mother of all tricks: do not start negotiations until all the ducks are in a row.",
        "The nuclear option: can you build without this IP?"
      ]
    }
  ];

  // Handle step changes to control the flow
  const handleStepChange = (step: number, context?: any) => {
    // Show uni-specific content only when reliant on university IP
    if (step === 5 && context?.type === "company" && task.progress?.answers?.reliesOnUniIp === "yes") {
      // After seeing general content, we'll show university-specific content
      setTimeout(() => {
        // Move to uni-specific content after general content is shown
      }, 100);
    }
  };

  // If task is already completed, show completion message
  if (isCompleted) {
    return (
      <div className="bg-green-50 p-4 rounded-md text-green-800 space-y-2">
        <h3 className="font-medium">IP Due Diligence Completed</h3>
        <p>You've completed the IP due diligence assessment.</p>
        <Card className="p-4 mt-4 bg-white">
          <p className="text-gray-600 text-sm">
            {APP_NAME} has recorded your IP due diligence responses. This information will help you navigate
            your intellectual property strategy.
          </p>
        </Card>
      </div>
    );
  }

  // Use the StepBasedTaskLogic component which has back button functionality
  return (
    <StepBasedTaskLogic
      steps={steps}
      isCompleted={isCompleted}
      onComplete={onComplete}
      conditionalFlow={conditionalFlow}
      onStepChange={handleStepChange}
    />
  );
};

export default IpDetailedTaskLogic;
