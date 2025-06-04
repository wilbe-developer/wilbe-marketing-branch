
import { useState, useEffect } from "react";
import { 
  useSprintCollaborators, 
  type Collaborator,
  type AccessLevel
} from "@/hooks/useSprintCollaborators";
import { useSprintContext } from "@/hooks/useSprintContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, UserPlus, AlertTriangle, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CollaboratorsManagement = () => {
  const { canManage, isSharedSprint } = useSprintContext();
  const { 
    collaborators, 
    isLoading, 
    fetchCollaborators, 
    addCollaborator, 
    updateCollaboratorAccess,
    removeCollaborator 
  } = useSprintCollaborators();
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("edit");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleAddCollaborator = async () => {
    if (!email) return;
    await addCollaborator(email, accessLevel);
    setEmail("");
    setAccessLevel("edit");
    setAddDialogOpen(false);
  };

  const handleRemoveDialog = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setRemoveDialogOpen(true);
  };

  const handleRemoveCollaborator = async () => {
    if (!selectedCollaborator) return;
    await removeCollaborator(selectedCollaborator.id);
    setRemoveDialogOpen(false);
  };

  const getAccessLevelText = (level: AccessLevel) => {
    switch (level) {
      case 'view':
        return 'View only';
      case 'edit':
        return 'Can edit';
      case 'manage':
        return 'Can manage';
      default:
        return 'Custom access';
    }
  };

  const getAccessLevelIcon = (level: AccessLevel) => {
    switch (level) {
      case 'view':
        return <ShieldCheck className="h-4 w-4 text-gray-400" />;
      case 'edit':
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      case 'manage':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleChangeAccess = async (collaboratorId: string, newLevel: AccessLevel) => {
    await updateCollaboratorAccess(collaboratorId, newLevel);
  };

  // Show read-only view if user doesn't have manage access
  if (!canManage && isSharedSprint) {
    return (
      <Card className="mt-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> 
            <span>BSF Collaborators</span>
          </CardTitle>
          <CardDescription>
            You can view collaborators but don't have permission to manage them
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading collaborators...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="py-8 text-center border border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No collaborators to display
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div 
                  key={collaborator.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {collaborator.firstName || ''} {collaborator.lastName || ''}
                      {!collaborator.firstName && !collaborator.lastName && (
                        <span className="italic text-gray-500">Name not available</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{collaborator.email}</p>
                  </div>
                  
                  <div className="flex items-center">
                    {getAccessLevelIcon(collaborator.access_level as AccessLevel)}
                    <span className="ml-2 text-sm">
                      {getAccessLevelText(collaborator.access_level as AccessLevel)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full management view for owners and managers
  return (
    <Card className="mt-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> 
          <span>BSF Collaborators</span>
        </CardTitle>
        <CardDescription>
          Invite team members to collaborate on your BSF projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading collaborators...</p>
          </div>
        ) : collaborators.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-lg">
            <Users className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              You haven't added any collaborators yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div 
                key={collaborator.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {collaborator.firstName || ''} {collaborator.lastName || ''}
                    {!collaborator.firstName && !collaborator.lastName && (
                      <span className="italic text-gray-500">Name not available</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{collaborator.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={collaborator.access_level} 
                    onValueChange={(value: string) => handleChangeAccess(collaborator.id, value as AccessLevel)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <div className="flex items-center">
                        {getAccessLevelIcon(collaborator.access_level as AccessLevel)}
                        <span className="ml-2 text-sm">
                          {getAccessLevelText(collaborator.access_level as AccessLevel)}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="manage">Can manage</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveDialog(collaborator)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> 
              Add Collaborator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Collaborator</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to collaborate with.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="collaborator@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Access Level</label>
                <Select
                  value={accessLevel}
                  onValueChange={(value: string) => setAccessLevel(value as AccessLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p>View only</p>
                          <p className="text-xs text-gray-500">Can view the data room but not edit tasks</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-blue-500 mr-2" />
                        <div>
                          <p>Can edit</p>
                          <p className="text-xs text-gray-500">Can view and edit tasks</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="manage">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                        <div>
                          <p>Can manage</p>
                          <p className="text-xs text-gray-500">Can view, edit, and manage collaborators</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddCollaborator}
                disabled={!email}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Remove Collaborator</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this collaborator? They will no longer be able to access your BSF projects.
              </DialogDescription>
            </DialogHeader>
            {selectedCollaborator && (
              <div className="py-4">
                <p className="font-medium">
                  {selectedCollaborator.firstName || ''} {selectedCollaborator.lastName || ''}
                  {!selectedCollaborator.firstName && !selectedCollaborator.lastName && (
                    <span className="italic">Name not available</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">{selectedCollaborator.email}</p>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setRemoveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRemoveCollaborator}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
