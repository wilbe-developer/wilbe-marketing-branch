
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";

interface ContentStepRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (value: any) => void;
}

export const ContentStepRenderer: React.FC<ContentStepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  // Special function to render invite_link fields
  const renderInviteLink = () => {
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
  };

  // Check if this content step has an invite_link field
  const hasInviteLink = step.fields && step.fields.some(field => field.id === 'invite_link');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{step.text}</h3>
          
          {step.description && (
            <p className="text-gray-600">{step.description}</p>
          )}
          
          {step.content && (
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: step.content }} 
            />
          )}

          {/* Render invite link if it exists in the fields */}
          {hasInviteLink && renderInviteLink()}
          
          {/* Render other fields if needed */}
          {step.fields && step.fields.filter(field => field.id !== 'invite_link').map(field => (
            <div key={field.id} className="mt-4">
              {field.label && <h4 className="font-medium mb-2">{field.label}</h4>}
              {field.text && <p>{field.text}</p>}
              {field.content && (
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: field.content }} 
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
