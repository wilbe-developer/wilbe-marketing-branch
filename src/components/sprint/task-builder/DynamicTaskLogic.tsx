import React, { useState, useEffect } from "react";
import { useDynamicTask } from "@/hooks/task-builder/useDynamicTask";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useAuth } from "@/hooks/useAuth";
import { useAutoSaveManager } from "@/hooks/useAutoSaveManager";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import DynamicTaskStep from "./DynamicTaskStep";
import StaticPanels from "./StaticPanels";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DynamicTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

const DynamicTaskLogic: React.FC<DynamicTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const { isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const { manager: autoSaveManager } = useAutoSaveManager();
  
  const {
    taskDefinition,
    isLoading,
    visibleSteps,
    currentStep,
    currentStepIndex,
    answers,
    answerNode,
    uploadFile,
    updateProfile,
    completeTask,
    goToStep,
    isCompleted: taskIsCompleted,
  } = useDynamicTask({
    taskId: task.id,
    sprintProfile,
  });

  // Auto-save handler for individual fields
  const handleAutoSaveField = async (fieldId: string, value: any) => {
    if (!currentStep) return;
    
    try {
      // Update the current step's answer with the specific field
      const currentAnswer = answers[currentStep.id] || {};
      const updatedAnswer = { ...currentAnswer, [fieldId]: value };
      
      await answerNode(currentStep.id, updatedAnswer);
    } catch (error) {
      console.error("Error auto-saving field:", error);
      throw error; // Re-throw to trigger error handling in AutoSaveManager
    }
  };

  const handleAnswer = async (value: any) => {
    if (!currentStep) return;
    
    try {
      await answerNode(currentStep.id, value);
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Failed to save your answer. Please try again.");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentStep) return;
    
    try {
      await uploadFile(currentStep.id, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      // Force save any pending changes before completing
      if (currentStep) {
        autoSaveManager.forceSave(currentStep.id);
      }
      
      await completeTask();
      onComplete();
      setEditMode(false);
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete the task. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Force save any pending changes
      if (currentStep) {
        autoSaveManager.forceSave(currentStep.id);
      }
      
      await completeTask();
      toast.success("Your changes have been saved");
      setEditMode(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  // Cleanup auto-save manager on unmount
  useEffect(() => {
    return () => {
      autoSaveManager.cleanup();
    };
  }, [autoSaveManager]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!taskDefinition) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">Task definition not found</p>
      </div>
    );
  }

  // Show a task completed banner at the top if the task is completed
  const taskCompletedBanner = (isCompleted || taskIsCompleted) && !editMode ? (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Task completed!</p>
          <p className="text-sm mt-1">You have successfully completed this task.</p>
        </div>
        <Button 
          onClick={() => setEditMode(true)}
          variant="outline" 
          className="bg-white hover:bg-gray-50"
        >
          Edit Answers
        </Button>
      </div>
    </div>
  ) : null;

  // If there are no profile questions, render the task directly
  if (!taskDefinition.profileQuestions || taskDefinition.profileQuestions.length === 0) {
    return (
      <div className="space-y-6">
        {taskCompletedBanner}
        {renderTaskContent()}
      </div>
    );
  }

  // If there are profile questions, make sure they're answered first
  const requiredProfileKeys = taskDefinition.profileQuestions.map(q => q.key);
  const profileKeysAnswered = requiredProfileKeys.every(key => 
    sprintProfile && sprintProfile[key] !== undefined
  );

  if (!profileKeysAnswered && !editMode) {
    // Render profile questions first
    return renderProfileQuestions();
  }

  // All profile questions are answered, render the task
  return (
    <div className="space-y-6">
      {taskCompletedBanner}
      {renderTaskContent()}
    </div>
  );

  function renderProfileQuestions() {
    if (!taskDefinition) return null;
    
    // Render one profile question at a time
    const unansweredKeys = taskDefinition.profileQuestions
      .filter(q => sprintProfile[q.key] === undefined)
      .map(q => q.key);
    
    if (unansweredKeys.length === 0) return renderTaskContent();
    
    const currentQuestion = taskDefinition.profileQuestions.find(
      q => q.key === unansweredKeys[0]
    );
    
    if (!currentQuestion) return renderTaskContent();
    
    return (
      <div className="space-y-6">
        <SprintProfileShowOrAsk
          profileKey={currentQuestion.key}
          label={currentQuestion.text}
          type={mapProfileType(currentQuestion.type)}
          options={currentQuestion.options ? currentQuestion.options.map(option => ({ 
            value: option, 
            label: option 
          })) : undefined}
        >
          {/* This will only render when the profile question is answered */}
          {renderTaskContent()}
        </SprintProfileShowOrAsk>
      </div>
    );
  }

  function renderTaskContent() {
    // If the task is completed and not in edit mode, just show the completed banner
    if ((isCompleted || taskIsCompleted) && !editMode) {
      return (
        <div className="space-y-4">
          <div className="border rounded-md p-4 space-y-6">
            {visibleSteps.map((step, index) => {
              // Check if this step has profile dependencies
              const profileDependencies = getStepProfileDependencies(step);
              
              const stepContent = (
                <div key={step.id} className="mb-6 pb-6 border-b last:border-b-0">
                  <h3 className="text-lg font-medium mb-2">{step.text}</h3>
                  {renderStepAnswer(step, answers[step.id])}
                </div>
              );
              
              // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
              if (profileDependencies.length > 0) {
                const dependency = profileDependencies[0]; // Use the first dependency for now
                return (
                  <SprintProfileShowOrAsk
                    key={step.id}
                    profileKey={dependency.profileKey}
                    label={dependency.profileKey} // This should be improved to use a proper label
                    type="boolean" // This should be determined dynamically based on the profile field
                  >
                    {stepContent}
                  </SprintProfileShowOrAsk>
                );
              }
              
              return stepContent;
            })}
          </div>
        </div>
      );
    }
    
    // In edit mode or if the task is not completed yet, show the interactive UI
    return (
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            Step {currentStepIndex + 1} of {visibleSteps.length}
          </div>
          <div>
            {Math.round(((currentStepIndex + 1) / visibleSteps.length) * 100)}% complete
          </div>
        </div>
        
        {/* Current step */}
        {currentStep && renderCurrentStepWithDependencies()}
        
        {/* Static panels if any - NOW WITH ADMIN SUPPORT */}
        {taskDefinition.staticPanels && taskDefinition.staticPanels.length > 0 && (
          <StaticPanels
            panels={taskDefinition.staticPanels}
            profileAnswers={sprintProfile}
            stepAnswers={answers}
            isAdmin={isAdmin}
            taskId={task.id}
          />
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => goToStep(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
          >
            Previous
          </Button>
          
          {(isCompleted || taskIsCompleted) && editMode ? (
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          ) : currentStepIndex === visibleSteps.length - 1 ? (
            <Button onClick={handleComplete}>
              Complete Task
            </Button>
          ) : (
            <Button 
              onClick={() => goToStep(currentStepIndex + 1)}
              disabled={
                currentStepIndex === visibleSteps.length - 1 ||
                (!answers[currentStep?.id] && currentStep?.type === "question")
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Helper function to render current step with profile dependencies
  function renderCurrentStepWithDependencies() {
    if (!currentStep) return null;
    
    // Check if this step has profile dependencies
    const profileDependencies = getStepProfileDependencies(currentStep);
    
    const stepContent = (
      <DynamicTaskStep
        step={currentStep}
        answer={answers[currentStep.id]}
        onAnswer={handleAnswer}
        onFileUpload={handleFileUpload}
        autoSaveManager={autoSaveManager}
        onAutoSaveField={handleAutoSaveField}
      />
    );
    
    // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
    if (profileDependencies.length > 0) {
      const dependency = profileDependencies[0]; // Use the first dependency for now
      return (
        <SprintProfileShowOrAsk
          profileKey={dependency.profileKey}
          label={dependency.profileKey} // This should be improved to use a proper label
          type="boolean" // This should be determined dynamically based on the profile field
        >
          {stepContent}
        </SprintProfileShowOrAsk>
      );
    }
    
    return stepContent;
  }

  // Helper function to render a step's answer for the completed view
  function renderStepAnswer(step: any, answer: any) {
    if (!answer) return <p className="text-gray-500 italic">No answer provided</p>;
    
    switch (step.type) {
      case "question":
        if (step.inputType === "radio" || step.inputType === "select") {
          const option = step.options?.find((opt: any) => opt.value === answer);
          return <p>{option ? option.label : answer}</p>;
        } else if (step.inputType === "textarea" || step.inputType === "text") {
          return <p>{answer}</p>;
        } else {
          return <p>{JSON.stringify(answer)}</p>;
        }
      case "file":
      case "upload":
        return (
          <p>
            {answer.fileName ? (
              <span className="text-blue-500">Uploaded: {answer.fileName}</span>
            ) : (
              <span>File uploaded</span>
            )}
          </p>
        );
      default:
        return <p>{JSON.stringify(answer)}</p>;
    }
  }

  // Helper function to get profile dependencies for a step
  function getStepProfileDependencies(step: any) {
    if (!step.conditions) return [];
    
    return step.conditions
      .filter((condition: any) => condition.source.profileKey)
      .map((condition: any) => ({
        profileKey: condition.source.profileKey,
        operator: condition.operator,
        value: condition.value
      }));
  }

  // Helper function to map profile question types to SprintProfileShowOrAsk types
  function mapProfileType(type: string): "string" | "boolean" | "select" | "multi-select" {
    switch (type) {
      case "text": return "string";
      case "boolean": return "boolean";
      case "select": return "select";
      case "multiselect": return "multi-select";
      default: return "boolean";
    }
  }
};

export default DynamicTaskLogic;
