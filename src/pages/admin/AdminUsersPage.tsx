
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUsersPage = () => {
  return (
    <FullScreenAdminLayout title="User Management">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500 mt-2">Manage users, roles, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            User management interface will be implemented here.
            This will include functionality for viewing, adding, editing, and deleting users,
            as well as managing their roles and permissions.
          </div>
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminUsersPage;
