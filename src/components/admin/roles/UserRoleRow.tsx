
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile, UserRole } from "@/types";

interface UserRoleRowProps {
  user: UserProfile;
  userRoles: UserRole[];
  onRoleToggle: (userId: string, role: UserRole, hasRole: boolean) => void;
}

const UserRoleRow = ({ user, userRoles, onRoleToggle }: UserRoleRowProps) => {
  const hasAdminRole = userRoles.includes('admin');
  const hasMemberRole = userRoles.includes('member');

  const getInitials = (firstName: string, lastName: string) => {
    // Handle null, undefined, or empty strings properly
    const first = firstName && firstName.trim() ? firstName.trim().charAt(0) : '';
    const last = lastName && lastName.trim() ? lastName.trim().charAt(0) : '';
    
    // If we have both initials, use them
    if (first && last) {
      return `${first}${last}`.toUpperCase();
    }
    
    // If we only have first name, use first two characters or first + first
    if (first && !last) {
      return firstName.length > 1 ? `${first}${firstName.charAt(1)}`.toUpperCase() : `${first}${first}`.toUpperCase();
    }
    
    // If we only have last name, use first two characters or first + first
    if (!first && last) {
      return lastName.length > 1 ? `${last}${lastName.charAt(1)}`.toUpperCase() : `${last}${last}`.toUpperCase();
    }
    
    // Fallback to email if available
    if (user.email) {
      const emailFirst = user.email.charAt(0).toUpperCase();
      return `${emailFirst}${emailFirst}`;
    }
    
    // Final fallback
    return 'UU';
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">
            {user.avatar && (
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            )}
            <AvatarFallback>
              {getInitials(user.firstName || '', user.lastName || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            {user.firstName} {user.lastName}
            <div className="text-sm text-gray-500">
              {user.role}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {hasAdminRole && <Badge variant="destructive">Admin</Badge>}
          {hasMemberRole && <Badge variant="default">Member</Badge>}
          {userRoles.includes('user') && !hasMemberRole && !hasAdminRole && <Badge variant="secondary">User</Badge>}
          {userRoles.length === 0 && <Badge variant="outline">No roles</Badge>}
        </div>
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
