import { useState, useEffect } from "react";
import { useSprintTasks } from "./useSprintTasks";
import { Step } from "@/components/sprint/StepBasedTaskLogic";
import { StepContext, StepContextType } from "@/hooks/team-step-builder/types";

export const useIPTaskData = (task: any, sprintProfile: any) => {
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepContext, setCurrentStepContext] = useState<StepContext | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const { updateProgress } = useSprintTasks();
  
  // Load existing file ID and answers if available
  useEffect(() => {
    if (task?.progress) {
      if (task.progress.file_id) {
        setUploadedFileId(task.progress.file_id);
      }
      
      // Load existing answers from progress
      if (task.progress.task_answers && Object.keys(task.progress.task_answers).length > 0) {
        setAnswers(task.progress.task_answers);
      }
    }
  }, [task?.progress]);
  
  // Build steps based on the existing task answers and profile
  useEffect(() => {
    if (!task || !sprintProfile) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the loaded answers
      const existingAnswers = answers;
      const hasUniversityIP = sprintProfile?.university_ip === true;
      const newSteps: Step[] = [];
      
      if (hasUniversityIP) {
        // University IP path - keep all in a single flow
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
        if (existingAnswers[0] === "yes") {
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
        } else if (existingAnswers[0] === "no") {
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
  const buildConditionalFlow = () => {
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
  };

  // Handle step changes and update answers
  const handleStepChange = (stepIndex: number, context?: StepContext) => {
    console.log("Step changed to:", stepIndex, context);
    setCurrentStepIndex(stepIndex);
    setCurrentStepContext(context);
  };

  // Update answers when a user selects an option
  const updateAnswers = (stepIndex: number, answer: any) => {
    console.log("IP task updateAnswers called with:", { stepIndex, answer });
    
    const newAnswers = { ...answers, [stepIndex]: answer };
    setAnswers(newAnswers);
    
    // Immediately save to database when answers change
    if (task?.id) {
      console.log("Saving IP task progress with answers:", newAnswers);
      updateProgress.mutate({
        taskId: task.id,
        completed: false,
        fileId: uploadedFileId,
        taskAnswers: newAnswers
      });
    }
  };

  // Complete the task and save data
  const handleComplete = async (currentAnswers: Record<string, any> = {}, fileId?: string) => {
    try {
      await updateProgress.mutateAsync({
        taskId: task.id,
        completed: true,
        fileId: fileId || uploadedFileId,
        taskAnswers: currentAnswers
      });
      return true;
    } catch (error) {
      console.error("Error saving IP task data:", error);
      return false;
    }
  };
  
  return {
    steps,
    isLoading,
    uploadedFileId,
    setUploadedFileId,
    updateProgress,
    handleComplete,
    handleStepChange,
    currentStepContext,
    currentStepIndex,
    conditionalFlow: buildConditionalFlow(),
    answers,
    updateAnswers
  };
};
