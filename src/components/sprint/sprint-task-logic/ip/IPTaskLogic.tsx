
import React, { useState, useEffect } from "react";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import StepBasedTaskLogic, { Step } from "@/components/sprint/StepBasedTaskLogic";
import { useIPTaskData } from "@/hooks/useIPTaskData";

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
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Load existing answers if available
  useEffect(() => {
    if (task.progress?.task_answers) {
      setAnswers(task.progress.task_answers);
    }
  }, [task.progress?.task_answers]);

  // Build steps based on the answers and profile
  useEffect(() => {
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
        ]
      });

      // Conditional follow-up based on TTO conversation answer
      if (answers[0] === "yes") {
        newSteps.push({
          type: "question",
          question: "Summarize the conversation with the TTO.",
          content: "Please provide details about your conversations with the Tech Transfer Office."
        });
        
        newSteps.push({
          type: "question",
          question: "List the preliminary licensing terms (especially % equity) the TTO expects (agreed or mentioned).",
          content: "Please provide details about any licensing terms that have been discussed."
        });
      } else if (answers[0] === "no") {
        newSteps.push({
          type: "question",
          question: "Explain your current plans for engaging with the TTO.",
          content: "Please provide details about how you plan to engage with the Tech Transfer Office."
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
        ]
      });

      // Follow-up based on IP ownership
      if (answers[0] === "yes") {
        newSteps.push({
          type: "question",
          question: "Have patents been filed?",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
          ]
        });

        // Follow-up based on patent filing
        if (answers[1] === "yes") {
          newSteps.push({
            type: "upload",
            action: "Upload your patent documents.",
            uploads: ["Patent documentation"]
          });
        } else if (answers[1] === "no") {
          newSteps.push({
            type: "question",
            question: "Explain your plans for filing patents.",
            content: "Please provide details about your patent filing strategy."
          });
        }
      } else if (answers[0] === "no") {
        newSteps.push({
          type: "question",
          question: "Explain the current status of IP ownership.",
          content: "Please provide details about who owns the IP and any arrangements in place."
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
      ]
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
        ]
      });
    }

    setSteps(newSteps);
  }, [sprintProfile, answers]);

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

  // Handle answer updates
  const handleAnswerUpdate = (stepIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepIndex]: value
    }));
  };

  // Save answers and complete the task
  const handleComplete = async (fileId?: string) => {
    try {
      await updateProgress.mutateAsync({
        taskId: task.id,
        completed: true,
        fileId,
        taskAnswers: answers
      });
      onComplete(fileId);
      return true;
    } catch (error) {
      console.error("Error saving IP task data:", error);
      return false;
    }
  };

  // Define the updateProgress variable
  const { updateProgress } = useIPTaskData(task, sprintProfile);

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
          onComplete={handleComplete}
          conditionalFlow={buildConditionalFlow()}
          onAnswerSelect={handleAnswerUpdate}
        />
      </SprintProfileShowOrAsk>
    </div>
  );
};

export default IPTaskLogic;
