
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import RolesManager from '@/components/admin/RolesManager';

const RolesManagerPage = () => {
  return (
    <FullScreenAdminLayout title="Role Management">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-gray-500 mt-2">Manage user roles and permissions</p>
      </div>
      
      <RolesManager />
    </FullScreenAdminLayout>
  );
};

export default RolesManagerPage;
