
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettingsPage = () => {
  return (
    <FullScreenAdminLayout title="Admin Settings">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Configure platform settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Platform settings will be implemented here.
            This will include configuration for features, appearance, and behavior of the platform.
          </div>
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminSettingsPage;
