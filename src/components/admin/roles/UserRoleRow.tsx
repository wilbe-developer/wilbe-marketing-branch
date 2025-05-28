
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserProfile, UserRole } from "@/types";

interface UserRoleRowProps {
  user: UserProfile;
  userRoles: UserRole[];
  onRoleToggle: (userId: string, role: UserRole, hasRole: boolean) => void;
}

const UserRoleRow = ({ user, userRoles, onRoleToggle }: UserRoleRowProps) => {
  const hasAdminRole = userRoles.includes('admin');
  const hasMemberRole = userRoles.includes('member');
  const hasUserRole = userRoles.includes('user');

  // Display the actual system role from user_roles table
  const systemRole = userRoles.length > 0 ? userRoles[0] : 'No role';

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <div>
            {user.firstName} {user.lastName}
            {user.role && (
              <div className="text-sm text-gray-500">
                {user.role}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {systemRole === 'admin' && <Badge variant="destructive">Admin</Badge>}
        {systemRole === 'member' && <Badge variant="default">Member</Badge>}
        {systemRole === 'user' && <Badge variant="secondary">User</Badge>}
        {systemRole === 'No role' && <Badge variant="outline">No role</Badge>}
      </TableCell>
      <TableCell>
        <Switch
          checked={hasAdminRole}
          onCheckedChange={(checked) => onRoleToggle(user.id, 'admin', !checked)}
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={hasMemberRole}
          onCheckedChange={(checked) => onRoleToggle(user.id, 'member', !checked)}
        />
      </TableCell>
      <TableCell>
        {user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : 'Never'}
      </TableCell>
    </TableRow>
  );
};

export default UserRoleRow;
