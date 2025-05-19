
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
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

interface CollaborationStepRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (value: any) => void;
}

export const CollaborationStepRenderer: React.FC<CollaborationStepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  console.log("Rendering CollaborationStepRenderer component with step:", step);
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  return (
    <div className="mt-4 p-6 bg-blue-50 rounded-md border border-blue-100">
      <h3 className="text-lg font-medium text-blue-800 mb-4">Team Collaboration</h3>
      <p className="text-gray-700 mb-6">
        {step.description || "Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks."}
      </p>
      
      <div className="flex flex-col space-y-4">
        <Button 
          onClick={() => setIsCollaboratorsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Manage Collaborators</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => handleAnswer("completed")}
          className="w-full"
        >
          Continue without adding collaborators
        </Button>
      </div>
      
      <Dialog open={isCollaboratorsDialogOpen} onOpenChange={setIsCollaboratorsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Team Collaborators</DialogTitle>
            <DialogDescription>
              Add or remove team members who can collaborate on your sprint.
            </DialogDescription>
          </DialogHeader>
          
          <CollaboratorsManagement />
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => {
              setIsCollaboratorsDialogOpen(false);
              handleAnswer("completed");
            }}>
              Save & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaborationStepRenderer;
