
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Users, UserCheck, Shield, Crown } from 'lucide-react';
import { UserRole } from '@/hooks/admin/useRoleManagement';
import RoleChangeConfirmDialog from './RoleChangeConfirmDialog';

interface RoleManagementTableProps {
  users: any[];
  searchQuery: string;
  selectedRole: string;
  selectedUsers: string[];
  onSearchChange: (query: string) => void;
  onRoleFilterChange: (role: string) => void;
  onUserSelect: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onBulkRoleChange: (userIds: string[], newRole: UserRole) => void;
  allSelected: boolean;
  someSelected: boolean;
}

const RoleManagementTable: React.FC<RoleManagementTableProps> = ({
  users,
  searchQuery,
  selectedRole,
  selectedUsers,
  onSearchChange,
  onRoleFilterChange,
  onUserSelect,
  onSelectAll,
  onRoleChange,
  onBulkRoleChange,
  allSelected,
  someSelected
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    userIds: string[];
    newRole: UserRole;
    userNames: string[];
  } | null>(null);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const user = users.find(u => u.user_id === userId);
    setPendingChange({
      userIds: [userId],
      newRole,
      userNames: [user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email || 'Unknown User']
    });
    setShowConfirmDialog(true);
  };

  const handleBulkRoleChange = (newRole: UserRole) => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.user_id));
    const userNames = selectedUserData.map(user => 
      user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email || 'Unknown User'
    );
    
    setPendingChange({
      userIds: selectedUsers,
      newRole,
      userNames
    });
    setShowConfirmDialog(true);
  };

  const confirmRoleChange = () => {
    if (pendingChange) {
      if (pendingChange.userIds.length === 1) {
        onRoleChange(pendingChange.userIds[0], pendingChange.newRole);
      } else {
        onBulkRoleChange(pendingChange.userIds, pendingChange.newRole);
      }
    }
    setShowConfirmDialog(false);
    setPendingChange(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'member': return <UserCheck className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'member': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.institution?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.current_role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email, or institution..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedRole} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="member">Members</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkRoleChange('user')}
            >
              Set as User
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkRoleChange('member')}
            >
              Set as Member
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkRoleChange('admin')}
            >
              Set as Admin
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  ref={(el) => {
                    if (el) {
                      (el as any).indeterminate = someSelected && !allSelected;
                    }
                  }}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Profile Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.user_id)}
                    onCheckedChange={(checked) => onUserSelect(user.user_id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : 'No name'
                        }
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.institution || 'Not specified'}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getRoleBadgeVariant(user.current_role)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getRoleIcon(user.current_role)}
                    {user.current_role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {user.has_profile && (
                      <Badge variant="outline" className="text-xs">Profile</Badge>
                    )}
                    {user.has_sprint_profile && (
                      <Badge variant="outline" className="text-xs">Sprint</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <Select onValueChange={(value) => handleRoleChange(user.user_id, value as UserRole)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Change role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your criteria.
        </div>
      )}

      <RoleChangeConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmRoleChange}
        userNames={pendingChange?.userNames || []}
        newRole={pendingChange?.newRole || 'user'}
        isMultiple={pendingChange ? pendingChange.userIds.length > 1 : false}
      />
    </div>
  );
};

export default RoleManagementTable;
