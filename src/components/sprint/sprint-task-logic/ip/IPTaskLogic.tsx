
import React, { useState, useEffect } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import StepBasedTaskLogic, { Step } from "@/components/sprint/StepBasedTaskLogic";
import { useIPTaskData } from "@/hooks/useIPTaskData";
import { StepContext } from "@/hooks/team-step-builder/types";

interface IPTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

const IPTaskLogic: React.FC<IPTaskLogicProps> = ({ 
  task, 
  isCompleted, 
  onComplete 
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepContext, setCurrentStepContext] = useState<StepContext | undefined>(undefined);
  
  // Use our data hook to handle the task data
  const { 
    uploadedFileId,
    setUploadedFileId,
    handleComplete
  } = useIPTaskData(task, sprintProfile);

  // Build steps based on the existing task answers and profile
  useEffect(() => {
    const existingAnswers = task.progress?.task_answers || {};
    const hasUniversityIP = sprintProfile?.university_ip === true;
    const newSteps: Step[] = [];
    
    if (hasUniversityIP) {
      // University IP path
      newSteps.push({
        type: "question",
        question: "Have you begun conversations with the Tech Transfer Office (TTO)?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],
        context: "ip"
      });

      // Conditional follow-up based on TTO conversation answer
      if (existingAnswers[0] === "yes") {
        newSteps.push({
          type: "question",
          question: "Summarize the conversation with the TTO.",
          content: "Please provide details about your conversations with the Tech Transfer Office.",
          context: "ip"
        });
        
        newSteps.push({
          type: "question",
          question: "List the preliminary licensing terms (especially % equity) the TTO expects (agreed or mentioned).",
          content: "Please provide details about any licensing terms that have been discussed.",
          context: "ip"
        });
      } else if (existingAnswers[0] === "no") {
        newSteps.push({
          type: "question",
          question: "Explain your current plans for engaging with the TTO.",
          content: "Please provide details about how you plan to engage with the Tech Transfer Office.",
          context: "ip"
        });
      }
    } else {
      // Non-university IP path
      newSteps.push({
        type: "question",
        question: "Do you own all the IP?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],
        context: "ip"
      });

      // Follow-up based on IP ownership
      if (existingAnswers[0] === "yes") {
        newSteps.push({
          type: "question",
          question: "Have patents been filed?",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
          ],
          context: "ip"
        });

        // Follow-up based on patent filing
        if (existingAnswers[1] === "yes") {
          newSteps.push({
            type: "upload",
            action: "Upload your patent documents.",
            uploads: ["Patent documentation"],
            context: "ip"
          });
        } else if (existingAnswers[1] === "no") {
          newSteps.push({
            type: "question",
            question: "Explain your plans for filing patents.",
            content: "Please provide details about your patent filing strategy.",
            context: "ip"
          });
        }
      } else if (existingAnswers[0] === "no") {
        newSteps.push({
          type: "question",
          question: "Explain the current status of IP ownership.",
          content: "Please provide details about who owns the IP and any arrangements in place.",
          context: "ip"
        });
      }
    }

    // Add IP Fundamentals content panel for everyone
    newSteps.push({
      type: "content",
      content: [
        "IP Fundamentals",
        "• You are the core asset of the company.",
        "• Role of inventions and why protecting them is crucial.",
        "• Why this IP is relevant to the company.",
        "• Raising funding for a science company without foundational IP.",
        "• Defining an IP strategy that matches market validation and strategy."
      ],
      context: "ip"
    });

    // Add University-IP Deep-Dive panel for those with university IP
    if (hasUniversityIP) {
      newSteps.push({
        type: "content",
        content: [
          "University-IP Deep-Dive",
          "• What is a Tech Transfer Office (TTO)?",
          "• How do they think and evaluate inventions?",
          "• Do they actually own your IP?",
          "• When / how should you approach them?",
          "• Switching from employee mindset to founder of an independent company.",
          "• Why nobody else can negotiate on your behalf (lawyers, investors, advisors, etc.).",
          "• Why this is the best opportunity to evolve as a founder.",
          "• The mother of all tricks: do not start negotiations until all the ducks are in a row.",
          "• The nuclear option: can you build without this IP?"
        ],
        context: "ip"
      });
    }

    setSteps(newSteps);
  }, [sprintProfile, task.progress?.task_answers]);

  // Create a proper conditional flow configuration
  const buildConditionalFlow = () => {
    const hasUniversityIP = sprintProfile?.university_ip === true;
    const conditionalFlow: Record<number, Record<string, number>> = {
      0: {
        "yes": 1,
        "no": 1
      }
    };
    
    return conditionalFlow;
  };

  // Handle step changes
  const handleStepChange = (stepIndex: number, context?: StepContext) => {
    setCurrentStepContext(context);
  };

  // Wrap onComplete to use our handler with answers
  const completeTask = async (fileId?: string) => {
    const success = await handleComplete(task.progress?.task_answers || {}, fileId);
    if (success) {
      onComplete(fileId);
    }
    return success;
  };

  return (
    <div>
      <SprintProfileShowOrAsk
        profileKey="university_ip"
        label="Is your company reliant on something you've invented / created at a university?"
        type="boolean"
      >
        <StepBasedTaskLogic
          steps={steps}
          isCompleted={isCompleted}
          onComplete={completeTask}
          conditionalFlow={buildConditionalFlow()}
          onStepChange={handleStepChange}
        />
      </SprintProfileShowOrAsk>
    </div>
  );
};

export default IPTaskLogic;
