
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import UserApprovalsTab from '@/components/admin/tabs/UserApprovalsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserApprovalsPage = () => {
  return (
    <FullScreenAdminLayout title="User Approvals">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Approvals</h1>
        <p className="text-gray-500 mt-2">Review and approve user membership applications and sprint signups</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <UserApprovalsTab />
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default UserApprovalsPage;
