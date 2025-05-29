
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, User, ShieldCheck } from 'lucide-react';
import { useRoleManagement } from '@/hooks/admin/useRoleManagement';
import RoleStatsCards from './RoleStatsCards';
import RoleManagementTable from './RoleManagementTable';
import RoleFilters from './RoleFilters';

const RoleManagementDashboard = () => {
  const {
    users,
    loading,
    roleStats,
    refreshData,
    updateUserRole,
    bulkUpdateRoles
  } = useRoleManagement();

  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'member' | 'user'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    refreshData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = searchTerm === '' || 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institution?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member' | 'user') => {
    try {
      await updateUserRole(userId, newRole);
      setSelectedUsers(new Set()); // Clear selection after update
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleBulkRoleChange = async (userIds: string[], newRole: 'admin' | 'member' | 'user') => {
    try {
      await bulkUpdateRoles(userIds, newRole);
      setSelectedUsers(new Set()); // Clear selection after update
    } catch (error) {
      console.error('Failed to bulk update roles:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoleStatsCards stats={roleStats} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RoleFilters
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedUsers={selectedUsers}
              onBulkRoleChange={handleBulkRoleChange}
            />
            
            <RoleManagementTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              onRoleChange={handleRoleChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementDashboard;
