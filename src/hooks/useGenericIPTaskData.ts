
import { useState, useEffect, useMemo } from "react";
import { useTaskBase, TaskStep } from "./useTaskBase";

export const useGenericIPTaskData = (task: any, sprintProfile: any) => {
  const {
    answers,
    uploadedFileId,
    isLoading: baseIsLoading,
    handleStepChange,
    updateAnswer,
    updateAnswers,
    handleComplete,
    currentStepContext,
    setUploadedFileId
  } = useTaskBase({ 
    task, 
    sprintProfile,
    initialState: {
      // Pre-initialize with empty values to avoid undefined issues
      tto_conversation: '',
      tto_summary: '',
      tto_plans: '',
      licensing_terms: '',
      ip_ownership: '',
      patents_filed: '',
      patent_plans: '',
      patent_documents: '',
      ip_ownership_status: ''
    }
  });
  
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Build steps based on the existing task answers and profile
  useEffect(() => {
    if (!task || !sprintProfile) {
      return;
    }

    setIsLoading(true);
    
    try {
      const hasUniversityIP = sprintProfile?.university_ip === true;
      const newSteps: TaskStep[] = [];
      
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

        // Follow-up questions based on TTO conversation
        if (answers["tto_conversation"] === "yes") {
          newSteps.push({
            type: "question",
            question: "Summarize the conversation with the Tech Transfer Office.",
            content: "Please provide details about your conversations with the Tech Transfer Office.",
            context: "ip"
          });
          
          newSteps.push({
            type: "question",
            question: "List the preliminary licensing terms (especially % equity) the TTO expects.",
            content: "Please provide details about any licensing terms that have been discussed.",
            context: "ip"
          });
        } else if (answers["tto_conversation"] === "no") {
          newSteps.push({
            type: "question",
            question: "Explain your current plans for engaging with the TTO.",
            content: "Please provide details about how you plan to engage with the Tech Transfer Office.",
            context: "ip"
          });
        }
        
        // Add IP Fundamentals content for university path
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
        
        // Add University-IP Deep-Dive panel
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
        if (answers["ip_ownership"] === "yes") {
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
          if (answers["patents_filed"] === "yes") {
            newSteps.push({
              type: "upload",
              action: "Upload your patent documents.",
              uploads: ["Patent documentation"],
              context: "ip"
            });
          } else if (answers["patents_filed"] === "no") {
            newSteps.push({
              type: "question",
              question: "Explain your plans for filing patents.",
              content: "Please provide details about your patent filing strategy.",
              context: "ip"
            });
          }
        } else if (answers["ip_ownership"] === "no") {
          newSteps.push({
            type: "question",
            question: "Explain the current status of IP ownership.",
            content: "Please provide details about who owns the IP and any arrangements in place.",
            context: "ip"
          });
        }
        
        // Add IP Fundamentals content for non-university path
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
      }

      setSteps(newSteps);
    } catch (error) {
      console.error("Error building IP task steps:", error);
      setSteps([]);
    } finally {
      setIsLoading(false);
    }
  }, [sprintProfile, task, answers]);

  // Create a proper conditional flow configuration
  const conditionalFlow = useMemo(() => {
    const hasUniversityIP = sprintProfile?.university_ip === true;
    
    if (hasUniversityIP) {
      // For university IP, the follow-up questions depend on the answer to the first question
      return {
        0: { // TTO conversation question
          "yes": 1, // Go to summarize conversation
          "no": 1   // Go to explain plans
        }
      };
    } else {
      // For non-university IP, the flow is similar
      return {
        0: { // IP ownership question
          "yes": 1, // Go to patents filed question
          "no": 1   // Go to explain IP ownership
        },
        1: { // Patents filed question (if owner is yes)
          "yes": 2, // Go to upload patents
          "no": 2   // Go to explain patent plans
        }
      };
    }
  }, [sprintProfile]);

  // Map numeric index to semantic key for current step
  const getKeyForStep = (stepIndex: number): string => {
    const hasUniversityIP = sprintProfile?.university_ip === true;
    
    if (hasUniversityIP) {
      switch (stepIndex) {
        case 0: return "tto_conversation";
        case 1: 
          return answers["tto_conversation"] === "yes" 
            ? "tto_summary" 
            : "tto_plans";
        case 2:
          return answers["tto_conversation"] === "yes" 
            ? "licensing_terms" 
            : "ip_fundamentals";
        default: return `step_${stepIndex}`;
      }
    } else {
      switch (stepIndex) {
        case 0: return "ip_ownership";
        case 1: 
          return answers["ip_ownership"] === "yes" 
            ? "patents_filed" 
            : "ip_ownership_status";
        case 2:
          if (answers["ip_ownership"] === "yes") {
            return answers["patents_filed"] === "yes" 
              ? "patent_documents" 
              : "patent_plans";
          }
          return "ip_fundamentals";
        default: return `step_${stepIndex}`;
      }
    }
  };

  // Custom updateAnswers to map step index to semantic key
  const handleUpdateAnswers = (stepIndex: number, answer: any) => {
    const key = getKeyForStep(stepIndex);
    updateAnswer(key, answer);
  };

  return {
    steps,
    isLoading: isLoading || baseIsLoading,
    uploadedFileId,
    setUploadedFileId,
    handleComplete,
    handleStepChange,
    currentStepContext,
    conditionalFlow,
    answers,
    updateAnswers: handleUpdateAnswers
  };
};
