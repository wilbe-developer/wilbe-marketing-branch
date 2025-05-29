
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, Shield, User } from 'lucide-react';

interface UserWithRoles {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar: string | null;
  created_at: string | null;
  roles: string[];
}

interface RoleUsersTableProps {
  users: UserWithRoles[];
  isLoading: boolean;
  onRoleUpdate: (userId: string, newRole: string, currentRoles: string[]) => Promise<void>;
}

const RoleUsersTable = ({ users, isLoading, onRoleUpdate }: RoleUsersTableProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'member':
        return 'secondary';
      case 'user':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'member':
        return <Shield className="h-3 w-3" />;
      case 'user':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getPrimaryRole = (roles: string[]) => {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('member')) return 'member';
    return 'user';
  };

  const handleRoleChange = async (userId: string, newRole: string, currentRoles: string[]) => {
    await onRoleUpdate(userId, newRole, currentRoles);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found matching your criteria
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const displayName = user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user.first_name || user.email || 'Unknown User';
          
          const primaryRole = getPrimaryRole(user.roles);

          return (
            <TableRow key={user.user_id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayName}</span>
                </div>
              </TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(primaryRole)} className="flex items-center gap-1 w-fit">
                  {getRoleIcon(primaryRole)}
                  {primaryRole}
                </Badge>
              </TableCell>
              <TableCell>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                <Select
                  value={primaryRole}
                  onValueChange={(newRole) => handleRoleChange(user.user_id, newRole, user.roles)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Member
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-3 w-3" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RoleUsersTable;
