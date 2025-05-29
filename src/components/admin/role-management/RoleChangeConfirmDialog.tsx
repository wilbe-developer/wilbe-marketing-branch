
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, ShieldCheck, User } from 'lucide-react';

interface RoleChangeConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  currentRole: string;
  newRole: string;
}

const RoleChangeConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  currentRole,
  newRole
}: RoleChangeConfirmDialogProps) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'member':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'user':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'member':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const isDowngrade = (currentRole === 'admin' && newRole !== 'admin') || 
                      (currentRole === 'member' && newRole === 'user');

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access to all admin features and user management';
      case 'member':
        return 'Access to member-only content and features';
      case 'user':
        return 'Basic user access with limited features';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDowngrade && <AlertTriangle className="h-5 w-5 text-orange-500" />}
            Confirm Role Change
          </DialogTitle>
          <DialogDescription>
            You are about to change the role for <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm text-gray-600">Current Role</p>
              <Badge variant={getRoleBadgeVariant(currentRole)} className="flex items-center gap-1 w-fit mt-1">
                {getRoleIcon(currentRole)}
                {currentRole}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{getRoleDescription(currentRole)}</p>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div>
              <p className="text-sm text-gray-600">New Role</p>
              <Badge variant={getRoleBadgeVariant(newRole)} className="flex items-center gap-1 w-fit mt-1">
                {getRoleIcon(newRole)}
                {newRole}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{getRoleDescription(newRole)}</p>
            </div>
          </div>

          {isDowngrade && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Warning: This is a role downgrade</p>
                <p className="text-orange-700">The user will lose access to features available in their current role.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant={isDowngrade ? "destructive" : "default"}>
            {isDowngrade ? 'Confirm Downgrade' : 'Confirm Change'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeConfirmDialog;
