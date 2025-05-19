
import React, { useState, useEffect } from "react";
import { useDynamicTask } from "@/hooks/task-builder/useDynamicTask";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { SprintProfileShowOrAsk } from "@/components/sprint/SprintProfileShowOrAsk";
import DynamicTaskStep from "./task-builder/DynamicTaskStep";
import StaticPanels from "./task-builder/StaticPanels";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProfileFieldMapping } from "@/utils/profileFieldMappings";

interface DynamicTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  initialAnswers?: Record<string, any>;
}

const DynamicTaskLogic: React.FC<DynamicTaskLogicProps> = ({
  task,
  isCompleted,
  onComplete,
  initialAnswers = {}
}) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
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
  } = useDynamicTask({
    taskId: task.id,
    sprintProfile,
  });

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
      await completeTask();
      onComplete();
      toast.success("Task completed successfully!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete the task. Please try again.");
    }
  };

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

  // If there are no profile questions, render the task directly
  if (!taskDefinition.profileQuestions || taskDefinition.profileQuestions.length === 0) {
    return renderTaskContent();
  }

  // If there are profile questions, make sure they're answered first
  const requiredProfileKeys = taskDefinition.profileQuestions.map(q => q.key);
  const profileKeysAnswered = requiredProfileKeys.every(key => 
    sprintProfile && sprintProfile[key] !== undefined
  );

  if (!profileKeysAnswered) {
    // Render profile questions first
    return renderProfileQuestions();
  }

  // All profile questions are answered, render the task
  return renderTaskContent();

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
    
    const fieldMapping = getProfileFieldMapping(currentQuestion.key);
    
    // If we have options defined in the task definition, use those
    const options = currentQuestion.options ? 
      currentQuestion.options.map(option => ({ value: option, label: option })) : 
      fieldMapping.options;
    
    return (
      <div className="space-y-6">
        <SprintProfileShowOrAsk
          profileKey={currentQuestion.key}
          label={currentQuestion.text || fieldMapping.label}
          type={mapProfileType(currentQuestion.type) || fieldMapping.type}
          options={options}
        >
          {/* This will only render when the profile question is answered */}
          {renderTaskContent()}
        </SprintProfileShowOrAsk>
      </div>
    );
  }

  function renderTaskContent() {
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
        
        {/* Static panels if any */}
        {taskDefinition.staticPanels && taskDefinition.staticPanels.length > 0 && (
          <StaticPanels
            panels={taskDefinition.staticPanels}
            profileAnswers={sprintProfile}
            stepAnswers={answers}
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
          
          {currentStepIndex === visibleSteps.length - 1 ? (
            <Button onClick={handleComplete}>
              {isCompleted ? "Save" : "Complete Task"}
            </Button>
          ) : (
            <Button 
              onClick={() => goToStep(currentStepIndex + 1)}
              disabled={
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
      />
    );
    
    // If this step has profile dependencies, wrap it with SprintProfileShowOrAsk
    if (profileDependencies.length > 0) {
      const dependency = profileDependencies[0]; // Use the first dependency for now
      const fieldMapping = getProfileFieldMapping(dependency.profileKey);
      
      return (
        <SprintProfileShowOrAsk
          profileKey={dependency.profileKey}
          label={fieldMapping.label}
          type={fieldMapping.type}
          options={fieldMapping.options}
        >
          {stepContent}
        </SprintProfileShowOrAsk>
      );
    }
    
    return stepContent;
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
