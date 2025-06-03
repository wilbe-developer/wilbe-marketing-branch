import React, { useState } from 'react';
import { StepNode } from '@/types/task-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CollaboratorsManagement } from '@/components/sprint/CollaboratorsManagement';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface TeamMemberStepRendererProps {
  step: StepNode;
  answer: any;
  handleAnswer: (value: any) => void;
}

export const TeamMemberStepRenderer: React.FC<TeamMemberStepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    Array.isArray(answer) ? answer : (answer ? [answer] : [])
  );
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateMember = (id: string, field: string, value: string) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === id ? { ...member, [field]: value } : member
    );
    setTeamMembers(updatedMembers);
    handleAnswer(updatedMembers);
  };

  const removeMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id);
    setTeamMembers(updatedMembers);
    handleAnswer(updatedMembers);
  };

  return (
    <div className="space-y-6">
      {/* Team Members Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">Team Members</h4>
          <Button onClick={addMember} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {teamMembers.map((member, index) => (
          <div key={member.id} className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${member.id}`}>Name</Label>
              <Input
                type="text"
                id={`name-${member.id}`}
                value={member.name}
                onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                placeholder="Member Name"
              />
            </div>
            <div>
              <Label htmlFor={`role-${member.id}`}>Role</Label>
              <Input
                type="text"
                id={`role-${member.id}`}
                value={member.role}
                onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                placeholder="Member Role"
              />
            </div>
            <Button onClick={() => removeMember(member.id)} variant="ghost" size="sm">
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Collaboration Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-3">Team Collaboration</h4>
        <p className="text-sm text-blue-700 mb-4">
          Invite your team members to collaborate on this BSF. They will be able to view and contribute to tasks.
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
                Add or remove team members who can collaborate on your BSF.
              </DialogDescription>
            </DialogHeader>
            
            <CollaboratorsManagement />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
