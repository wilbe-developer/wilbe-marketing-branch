
import React, { useState, useEffect } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface UserRoleRowProps {
  user: UserProfile;
  userRoles: UserRole[];
  onRoleToggle: (userId: string, role: UserRole, hasRole: boolean) => void;
}

const UserRoleRow = ({ user, userRoles, onRoleToggle }: UserRoleRowProps) => {
  const [userType, setUserType] = useState<'Sprint User' | 'Sandbox User' | 'Unknown'>('Unknown');
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: hasSprintProfile } = await supabase
          .rpc('has_completed_sprint_onboarding', {
            p_user_id: user.id
          });
        
        setUserType(hasSprintProfile ? 'Sprint User' : 'Sandbox User');
      } catch (error) {
        console.error('Error checking user type:', error);
        setUserType('Unknown');
      }
    };
    
    checkUserType();
  }, [user.id]);

  const hasAdminRole = userRoles.includes('admin');
  const hasMemberRole = userRoles.includes('user');

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Sprint User':
        return 'bg-blue-100 text-blue-800';
      case 'Sandbox User':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{user.firstName} {user.lastName}</div>
          {user.institution && (
            <div className="text-sm text-gray-500">{user.institution}</div>
          )}
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge className={`${getUserTypeColor(userType)}`}>
          {userType}
        </Badge>
      </TableCell>
      <TableCell>
        <Switch
          checked={hasAdminRole}
          onCheckedChange={() => onRoleToggle(user.id, 'admin', hasAdminRole)}
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={hasMemberRole}
          onCheckedChange={() => onRoleToggle(user.id, 'user', hasMemberRole)}
        />
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {formatDate(user.lastLoginDate)}
      </TableCell>
    </TableRow>
  );
};

export default UserRoleRow;
