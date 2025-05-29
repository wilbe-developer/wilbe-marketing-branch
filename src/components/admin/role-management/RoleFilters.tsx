
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, ShieldCheck, Users, User } from 'lucide-react';

interface RoleFiltersProps {
  selectedRole: 'all' | 'admin' | 'member' | 'user';
  onRoleChange: (role: 'all' | 'admin' | 'member' | 'user') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedUsers: Set<string>;
  onBulkRoleChange: (userIds: string[], newRole: 'admin' | 'member' | 'user') => void;
}

const RoleFilters = ({
  selectedRole,
  onRoleChange,
  searchTerm,
  onSearchChange,
  selectedUsers,
  onBulkRoleChange
}: RoleFiltersProps) => {
  const handleBulkAction = (newRole: 'admin' | 'member' | 'user') => {
    if (selectedUsers.size > 0) {
      onBulkRoleChange(Array.from(selectedUsers), newRole);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or institution..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedRole === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRoleChange('all')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            All
          </Button>
          <Button
            variant={selectedRole === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRoleChange('admin')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4 text-red-500" />
            Admins
          </Button>
          <Button
            variant={selectedRole === 'member' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRoleChange('member')}
            className="flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Members
          </Button>
          <Button
            variant={selectedRole === 'user' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRoleChange('user')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4 text-gray-500" />
            Users
          </Button>
        </div>
      </div>

      {selectedUsers.size > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {selectedUsers.size} selected
          </Badge>
          <Select onValueChange={(value) => handleBulkAction(value as 'admin' | 'member' | 'user')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bulk change role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Make Admin</SelectItem>
              <SelectItem value="member">Make Member</SelectItem>
              <SelectItem value="user">Make User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RoleFilters;
