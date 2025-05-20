
import React, { useState } from "react";
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

interface CollaborationFieldRendererProps {
  label?: string;
  text?: string;
}

export const CollaborationFieldRenderer: React.FC<CollaborationFieldRendererProps> = ({
  label = "Team Collaboration",
  text,
}) => {
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
      <h4 className="font-medium text-blue-800 mb-3">{label}</h4>
      {text && <p className="text-sm text-blue-700 mb-4">{text}</p>}
      {!text && (
        <p className="text-sm text-blue-700 mb-4">
          Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks.
        </p>
      )}
      
      <Button 
        onClick={() => setIsCollaboratorsDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2"
      >
        <Users className="h-4 w-4" />
        <span>Manage Collaborators</span>
      </Button>
      
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
