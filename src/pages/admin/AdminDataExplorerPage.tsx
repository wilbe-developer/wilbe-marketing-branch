
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDataExplorerPage = () => {
  return (
    <FullScreenAdminLayout title="Data Explorer">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Explorer</h1>
        <p className="text-gray-500 mt-2">Explore and analyze platform data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Data explorer will be implemented here.
            This will provide tools for querying, visualizing, and exporting data from the platform.
          </div>
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminDataExplorerPage;
