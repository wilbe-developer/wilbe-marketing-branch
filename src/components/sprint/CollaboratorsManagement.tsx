
import { useState, useEffect } from "react";
import { 
  useSprintCollaborators, 
  type Collaborator,
  type AccessLevel
} from "@/hooks/useSprintCollaborators";
import { useTeamInvitations, type PendingInvitation } from "@/hooks/useTeamInvitations";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, UserPlus, AlertTriangle, Trash2, ShieldCheck, Send, RefreshCw, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CollaboratorsManagement = () => {
  const { canManage, isSharedSprint } = useSprintContext();
  const { 
    collaborators, 
    isLoading: collaboratorsLoading, 
    fetchCollaborators, 
    addCollaborator, 
    updateCollaboratorAccess,
    removeCollaborator 
  } = useSprintCollaborators();
  const {
    invitations,
    isLoading: invitationsLoading,
    fetchInvitations,
    sendInvitation,
    resendInvitation,
    cancelInvitation
  } = useTeamInvitations();
  
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("edit");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [cancelInviteDialogOpen, setCancelInviteDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<PendingInvitation | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchCollaborators();
    fetchInvitations();
  }, []);

  const handleSendInvitation = async () => {
    if (!email) return;
    await sendInvitation(email, accessLevel);
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

  const handleCancelInviteDialog = (invitation: PendingInvitation) => {
    setSelectedInvitation(invitation);
    setCancelInviteDialogOpen(true);
  };

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) return;
    await cancelInvitation(selectedInvitation.id);
    setCancelInviteDialogOpen(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show read-only view if user doesn't have manage access
  if (!canManage && isSharedSprint) {
    return (
      <Card className="mt-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> 
            <span>Team Access</span>
          </CardTitle>
          <CardDescription>
            You can view team access but don't have permission to manage them
          </CardDescription>
        </CardHeader>
        <CardContent>
          {collaboratorsLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading access...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="py-8 text-center border border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No team access to display
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
          <span>Team Access</span>
        </CardTitle>
        <CardDescription>
          Invite team members to work on your BSF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Team Members ({collaborators.length})</TabsTrigger>
            <TabsTrigger value="invitations">Pending Invitations ({invitations.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="mt-4">
            {collaboratorsLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading team members...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="py-8 text-center border border-dashed rounded-lg">
                <Users className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No team members yet
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
          </TabsContent>
          
          <TabsContent value="invitations" className="mt-4">
            {invitationsLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading invitations...</p>
              </div>
            ) : invitations.length === 0 ? (
              <div className="py-8 text-center border border-dashed rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No pending invitations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div 
                    key={invitation.id} 
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited on {formatDate(invitation.created_at)} • Expires {formatDate(invitation.expires_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-sm">
                        {getAccessLevelIcon(invitation.access_level as AccessLevel)}
                        <span className="ml-1">
                          {getAccessLevelText(invitation.access_level as AccessLevel)}
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => resendInvitation(invitation.id)}
                        disabled={invitationsLoading}
                        title="Resend invitation"
                      >
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCancelInviteDialog(invitation)}
                        title="Cancel invitation"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> 
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Team Invitation</DialogTitle>
              <DialogDescription>
                Send an invitation to join your BSF team. They'll receive an email with a link to accept.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="teammember@example.com"
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
                          <p className="text-xs text-gray-500">Can view, edit, and manage access</p>
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
                onClick={handleSendInvitation}
                disabled={!email || invitationsLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove collaborator dialog */}
        <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Remove Access</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this team member? They will no longer be able to access your BSF.
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

        {/* Cancel invitation dialog */}
        <Dialog open={cancelInviteDialogOpen} onOpenChange={setCancelInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Cancel Invitation</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this invitation? The recipient will no longer be able to use this invitation link.
              </DialogDescription>
            </DialogHeader>
            {selectedInvitation && (
              <div className="py-4">
                <p className="font-medium">{selectedInvitation.email}</p>
                <p className="text-sm text-gray-500">
                  Invited on {formatDate(selectedInvitation.created_at)}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCancelInviteDialogOpen(false)}
              >
                Keep Invitation
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelInvitation}
              >
                Cancel Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
