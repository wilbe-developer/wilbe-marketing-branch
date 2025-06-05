
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  useSprintCollaborators, 
  type Collaborator 
} from "@/hooks/useSprintCollaborators";
import { CollaboratorsManagement } from "./CollaboratorsManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";

export const CollaborateButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { currentSprintOwnerId, canManage } = useSprintContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use currentSprintOwnerId for data room link
  const dataRoomUserId = currentSprintOwnerId || user?.id;

  const handleOpenDataRoom = () => {
    if (!dataRoomUserId) return;
    
    navigate(`/sprint/data-room/${dataRoomUserId}`);
    setIsDialogOpen(false);
  };

  // Don't show the button if user doesn't have manage access in a shared sprint
  if (!canManage) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Share className="h-4 w-4" />
          <span>Collaborate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>BSF Collaboration</DialogTitle>
          <DialogDescription>
            Manage your BSF collaborators and share your BSF content with team members or investors.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="collaborators" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="collaborators" className="flex-1">Collaborators</TabsTrigger>
            <TabsTrigger value="dataroom" className="flex-1">Data Room</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collaborators">
            <CollaboratorsManagement />
          </TabsContent>
          
          <TabsContent value="dataroom">
            <div className="space-y-4 p-2">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">About the Data Room</h3>
                <p className="text-sm text-blue-700 mb-2">
                  The Data Room presents your BSF information in an investor-friendly format, making it easy to share your progress and plans.
                </p>
                <p className="text-sm text-blue-700">
                  Anyone with the link can view your data room. You can share the link with investors, advisors, or team members.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button onClick={handleOpenDataRoom}>
                  Open Data Room
                </Button>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    readOnly
                    value={`${window.location.origin}/sprint/data-room/${dataRoomUserId}`}
                    className="flex-1 p-2 rounded border text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sprint/data-room/${dataRoomUserId}`);
                      toast({
                        title: "Link copied",
                        description: "Data room link copied to clipboard"
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
