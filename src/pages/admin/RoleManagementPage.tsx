
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  RefreshCcw, 
  Shield, 
  Crown, 
  User
} from 'lucide-react';
import { useRoleManagement } from '@/hooks/admin/useRoleManagement';
import RoleOverviewCards from '@/components/admin/roles/RoleOverviewCards';
import RoleUsersTable from '@/components/admin/roles/RoleUsersTable';

const RoleManagementPage = () => {
  const { 
    users, 
    roleCounts, 
    refreshData, 
    isLoading, 
    updateUserRole 
  } = useRoleManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter users based on search term and active tab
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'admin') return matchesSearch && user.roles?.includes('admin');
    if (activeTab === 'member') return matchesSearch && user.roles?.includes('member') && !user.roles?.includes('admin');
    if (activeTab === 'user') return matchesSearch && user.roles?.length === 1 && user.roles?.includes('user');
    
    return matchesSearch;
  }) || [];

  return (
    <FullScreenAdminLayout title="Role Management">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-gray-500 mt-2">Manage user roles and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshData()} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Role Overview Cards */}
      <RoleOverviewCards 
        roleCounts={roleCounts} 
        isLoading={isLoading} 
      />

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            User Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto mb-2 sm:mb-0"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
                <TabsTrigger value="member">Members</TabsTrigger>
                <TabsTrigger value="user">Users</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <RoleUsersTable 
            users={filteredUsers}
            isLoading={isLoading}
            onRoleUpdate={updateUserRole}
          />
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default RoleManagementPage;
