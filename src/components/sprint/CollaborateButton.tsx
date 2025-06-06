
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share, Eye, Globe, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CollaboratorsManagement } from "./CollaboratorsManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";
import { useDataRoomPrivacy } from "@/hooks/useDataRoomPrivacy";

export const CollaborateButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { currentSprintOwnerId, canManage } = useSprintContext();
  const { isPublic, isLoading, updatePrivacySetting, canManagePrivacy } = useDataRoomPrivacy(currentSprintOwnerId || undefined);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use currentSprintOwnerId for data room link
  const dataRoomUserId = currentSprintOwnerId || user?.id;

  const handleOpenDataRoom = () => {
    if (!dataRoomUserId) {
      console.error("No data room user ID available");
      toast({
        title: "Error",
        description: "Unable to determine data room owner",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Opening data room for user:", dataRoomUserId);
    navigate(`/sprint/data-room/${dataRoomUserId}`);
    setIsDialogOpen(false);
  };

  const handleCopyLink = () => {
    if (!isPublic) {
      toast({
        title: "Data room is private",
        description: "Please make your data room public first to share the link",
        variant: "destructive"
      });
      return;
    }

    if (!dataRoomUserId) {
      toast({
        title: "Error",
        description: "Unable to determine data room owner",
        variant: "destructive"
      });
      return;
    }

    const dataRoomUrl = `${window.location.origin}/sprint/data-room/${dataRoomUserId}`;
    console.log("Copying data room link:", dataRoomUrl);
    
    navigator.clipboard.writeText(dataRoomUrl);
    toast({
      title: "Link copied",
      description: "Data room link copied to clipboard"
    });
  };

  // Don't show the button if user doesn't have manage access
  if (!canManage) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Your Team</DialogTitle>
          <DialogDescription>
            Share access to your BSF with team members and manage your data room visibility.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="collaborators" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="collaborators" className="flex-1">Team</TabsTrigger>
            <TabsTrigger value="dataroom" className="flex-1">Data Room</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collaborators">
            <CollaboratorsManagement />
          </TabsContent>
          
          <TabsContent value="dataroom">
            <div className="space-y-6 p-2">
              {/* Privacy Toggle Section - Show if user can manage privacy */}
              {canManagePrivacy && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {isPublic ? <Globe className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-gray-500" />}
                      <div>
                        <h4 className="font-medium">
                          {isPublic ? "Public Data Room" : "Private Data Room"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isPublic 
                            ? "Anyone with the link can view this data room" 
                            : "Only team members can access this data room"
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={updatePrivacySetting}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {isLoading && (
                    <div className="text-sm text-gray-500 mt-2">
                      Updating privacy setting...
                    </div>
                  )}
                </div>
              )}

              {/* Read-only privacy status for non-managers */}
              {!canManagePrivacy && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    {isPublic ? <Globe className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-gray-500" />}
                    <div>
                      <h4 className="font-medium">
                        {isPublic ? "Public Data Room" : "Private Data Room"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        This data room is {isPublic ? "publicly accessible" : "private"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Room Description */}
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">About the Data Room</h3>
                <p className="text-sm text-blue-700 mb-2">
                  The Data Room presents your BSF uploads and progress, making it easy to view your work and plans.
                </p>
                <p className="text-sm text-blue-700">
                  You can share this with investors, advisors, or team members when it's public.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button onClick={handleOpenDataRoom} className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Data Room
                </Button>
                
                {isPublic && (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      readOnly
                      value={`${window.location.origin}/sprint/data-room/${dataRoomUserId}`}
                      className="flex-1 p-2 rounded border text-sm bg-gray-50"
                    />
                    <Button size="sm" onClick={handleCopyLink}>
                      Copy Link
                    </Button>
                  </div>
                )}
                
                {!isPublic && (
                  <div className="text-center p-3 bg-gray-50 rounded border border-dashed">
                    <p className="text-sm text-gray-500">
                      {canManagePrivacy 
                        ? "Make the data room public to generate a shareable link"
                        : "This data room is private"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
