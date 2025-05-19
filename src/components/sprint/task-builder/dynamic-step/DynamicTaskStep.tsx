import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionStepRenderer } from "./QuestionStepRenderer";
import { ContentStepRenderer } from "./ContentStepRenderer";
import { UploadStepRenderer } from "./UploadStepRenderer";
import { ExerciseStepRenderer } from "./ExerciseStepRenderer";
import { FormStepRenderer } from "@/components/sprint/dynamic-task/FormStepRenderer";
import { ConditionalQuestionRenderer } from "@/components/sprint/dynamic-task/ConditionalQuestionRenderer";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";

interface DynamicTaskStepProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload?: (file: File) => void;
}

const DynamicTaskStep: React.FC<DynamicTaskStepProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
}) => {
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  // Normalize step properties (handle both type and inputType)
  const normalizedStep = {
    ...step,
    type: step.type || step.inputType,
  };

  // Render a content field with special handling for invite_link
  const renderContentField = (field: any) => {
    // Check if this is the special invite_link field for collaborators
    if (field.id === 'invite_link') {
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-3">Team Collaboration</h4>
          <p className="text-sm text-blue-700 mb-4">
            Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks.
          </p>
          
          <Button 
            onClick={() => setIsCollaboratorsDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Collaborators</span>
          </Button>
          
          {/* Dialog for managing collaborators */}
          <Dialog open={isCollaboratorsDialogOpen} onOpenChange={setIsCollaboratorsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Manage Team Collaborators</DialogTitle>
                <DialogDescription>
                  Add or remove team members who can collaborate on your sprint.
                </DialogDescription>
              </DialogHeader>
              
              <CollaboratorsManagement />
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    
    // Regular content field rendering
    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
  };

  switch (normalizedStep.type) {
    case "question":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <QuestionStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );
      
    case "conditionalQuestion":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <ConditionalQuestionRenderer
                step={step}
                answer={answer}
                handleAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );
      
    case "form":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <FormStepRenderer
                step={step}
                answer={answer}
                handleAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "content":
      return <ContentStepRenderer step={step} answer={answer} handleAnswer={onAnswer} />;

    case "file":
    case "upload":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <UploadStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
                onFileUpload={onFileUpload}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "exercise":
    case "feedback":
    case "action":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {step.description && (
                <p className="text-gray-600 mb-4">{step.description}</p>
              )}
              <ExerciseStepRenderer
                step={step}
                answer={answer}
                onAnswer={onAnswer}
              />
            </div>
          </CardContent>
        </Card>
      );

    case "team-members":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {/* Use the TeamMemberStepRenderer for team member forms */}
              <div className="team-members-renderer">
                {React.createElement(
                  // Import from the module that contains the component
                  require('./TeamMemberStepRenderer').TeamMemberStepRenderer,
                  { step, answer, onAnswer }
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500">Unknown step type: {normalizedStep.type}</div>
          </CardContent>
        </Card>
      );
  }
};

export default DynamicTaskStep;
