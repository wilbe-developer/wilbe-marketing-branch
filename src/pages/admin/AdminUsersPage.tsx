
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  RefreshCcw, 
  MoreHorizontal, 
  Mail, 
  UserCheck, 
  UserX, 
  Download 
} from 'lucide-react';
import { useSprintAdminData } from '@/hooks/admin/useSprintAdminData';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminUsersPage = () => {
  const { unifiedSignups, refreshData, isLoading } = useSprintAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter users based on search term and active tab
  const filteredUsers = unifiedSignups?.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'sprint') return matchesSearch && user.source === 'sprint';
    if (activeTab === 'waitlist') return matchesSearch && user.source === 'waitlist';
    
    return matchesSearch;
  }) || [];

  // Export user data as CSV
  const exportUsers = () => {
    const csvHeader = "Name,Email,Status,Signup Date,Source\n";
    const csvContent = filteredUsers.map(user => {
      return `"${user.name || 'N/A'}","${user.email || 'N/A'}","${user.source === 'sprint' ? 'Active' : 'Waitlist'}","${new Date(user.created_at).toLocaleDateString()}","${user.source || 'Direct'}"`;
    }).join("\n");
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wilbe-users.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FullScreenAdminLayout title="User Management">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-2">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshData()} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            Add User
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto mb-2 sm:mb-0"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="sprint">Sprint Users</TabsTrigger>
                <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filters
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={exportUsers}
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={user.source === 'sprint' ? 'success' : 'secondary'}>
                        {user.source === 'sprint' ? 'Active' : 'Waitlist'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{user.source || 'Direct'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Send Email</span>
                          </DropdownMenuItem>
                          {user.source === 'waitlist' ? (
                            <DropdownMenuItem className="cursor-pointer">
                              <UserCheck className="mr-2 h-4 w-4" />
                              <span>Approve for Sprint</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Suspend Access</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No users found matching your search criteria</div>
          )}
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminUsersPage;
