
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminActivityLogPage = () => {
  return (
    <FullScreenAdminLayout title="Activity Log">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-gray-500 mt-2">View user activity and system events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Activity log will be implemented here.
            This will show a chronological record of user actions and system events on the platform.
          </div>
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminActivityLogPage;
