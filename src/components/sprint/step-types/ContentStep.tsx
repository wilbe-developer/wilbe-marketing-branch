
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

interface ContentStepProps {
  content: string | React.ReactNode | (string | React.ReactNode)[];
}

const ContentStep: React.FC<ContentStepProps> = ({ content }) => {
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);
  
  // Check if content includes a specific text that indicates we need to show the collaboration button
  const shouldShowCollaborationButton = typeof content === 'string' && 
    (content.includes('Invite them with the button below') || 
     content.toLowerCase().includes('collaboration'));

  // Render the collaboration section if needed
  const renderCollaborationButton = () => {
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

  if (Array.isArray(content)) {
    const [title, ...restContent] = content;
    
    return (
      <div className="space-y-4">
        {title && (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}
        
        {restContent.length > 0 && (
          <div className="space-y-4">
            {restContent.map((item, idx) => (
              <div key={idx}>
                {typeof item === 'string' ? (
                  <p className="text-gray-700">{item}</p>
                ) : (
                  item
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Show collaboration button if needed based on content */}
        {(typeof title === 'string' && title.includes('Invite them with the button below')) && renderCollaborationButton()}
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      {typeof content === 'string' ? (
        <div>
          <p className="text-gray-700">{content}</p>
          {shouldShowCollaborationButton && renderCollaborationButton()}
        </div>
      ) : (
        <div>
          {content}
          {shouldShowCollaborationButton && renderCollaborationButton()}
        </div>
      )}
    </div>
  );
};

export default ContentStep;
