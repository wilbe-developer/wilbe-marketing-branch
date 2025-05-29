
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ShieldCheck, User, Calendar } from 'lucide-react';
import RoleChangeConfirmDialog from './RoleChangeConfirmDialog';

interface RoleManagementUser {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  institution: string | null;
  role: 'admin' | 'member' | 'user';
  avatar: string | null;
  created_at: string | null;
  last_login_date: string | null;
}

interface RoleManagementTableProps {
  users: RoleManagementUser[];
  selectedUsers: Set<string>;
  onSelectionChange: (selectedUsers: Set<string>) => void;
  onRoleChange: (userId: string, newRole: 'admin' | 'member' | 'user') => void;
}

const RoleManagementTable = ({
  users,
  selectedUsers,
  onSelectionChange,
  onRoleChange
}: RoleManagementTableProps) => {
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    userName: string;
    currentRole: string;
    newRole: 'admin' | 'member' | 'user';
  } | null>(null);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(users.map(user => user.user_id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelection = new Set(selectedUsers);
    if (checked) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    onSelectionChange(newSelection);
  };

  const handleRoleChangeRequest = (userId: string, newRole: 'admin' | 'member' | 'user') => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return;

    const userName = user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.email || 'Unknown User';

    setPendingRoleChange({
      userId,
      userName,
      currentRole: user.role,
      newRole
    });
  };

  const handleConfirmRoleChange = () => {
    if (pendingRoleChange) {
      onRoleChange(pendingRoleChange.userId, pendingRoleChange.newRole);
      setPendingRoleChange(null);
    }
  };

  const isAllSelected = users.length > 0 && users.every(user => selectedUsers.has(user.user_id));
  const isPartiallySelected = users.some(user => selectedUsers.has(user.user_id)) && !isAllSelected;

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(ref) => {
                    if (ref) {
                      ref.indeterminate = isPartiallySelected;
                    }
                  }}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const displayName = user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.email || 'Unknown User';

              return (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.user_id)}
                      onCheckedChange={(checked) => handleSelectUser(user.user_id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{user.institution || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.last_login_date ? new Date(user.last_login_date).toLocaleDateString() : 'Never'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => handleRoleChangeRequest(user.user_id, newRole as 'admin' | 'member' | 'user')}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching the current filters.
        </div>
      )}

      <RoleChangeConfirmDialog
        isOpen={!!pendingRoleChange}
        onClose={() => setPendingRoleChange(null)}
        onConfirm={handleConfirmRoleChange}
        userName={pendingRoleChange?.userName || ''}
        currentRole={pendingRoleChange?.currentRole || ''}
        newRole={pendingRoleChange?.newRole || 'user'}
      />
    </>
  );
};

export default RoleManagementTable;
