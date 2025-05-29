
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import RoleManagementDashboard from '@/components/admin/role-management/RoleManagementDashboard';

const RoleManagementPage = () => {
  return (
    <FullScreenAdminLayout title="Role Management">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-gray-500 mt-2">Manage user roles and permissions across the platform</p>
      </div>
      
      <RoleManagementDashboard />
    </FullScreenAdminLayout>
  );
};

export default RoleManagementPage;
