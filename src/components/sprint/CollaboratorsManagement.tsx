
import { useState, useEffect } from "react";
import { 
  useSprintCollaborators, 
  type Collaborator 
} from "@/hooks/useSprintCollaborators";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, UserPlus, AlertTriangle, Trash2 } from "lucide-react";

export const CollaboratorsManagement = () => {
  const { 
    collaborators, 
    isLoading, 
    fetchCollaborators, 
    addCollaborator, 
    removeCollaborator 
  } = useSprintCollaborators();
  const [email, setEmail] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleAddCollaborator = async () => {
    if (!email) return;
    await addCollaborator(email);
    setEmail("");
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

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> 
          <span>Collaborators</span>
        </CardTitle>
        <CardDescription>
          Invite team members to collaborate on your sprint projects
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
                <div>
                  <p className="font-medium">
                    {collaborator.firstName || ''} {collaborator.lastName || ''}
                    {!collaborator.firstName && !collaborator.lastName && (
                      <span className="italic text-gray-500">Name not available</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{collaborator.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveDialog(collaborator)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
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
            <div className="py-4">
              <Input
                type="email"
                placeholder="collaborator@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
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
                Are you sure you want to remove this collaborator? They will no longer be able to access your sprint projects.
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
