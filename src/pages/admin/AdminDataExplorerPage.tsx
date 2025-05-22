
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const AdminDataExplorerPage = () => {
  return (
    <FullScreenAdminLayout title="Data Explorer">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Explorer</h1>
        <p className="text-gray-500 mt-2">Explore and analyze your sprint data</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Data Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Database className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Data Explorer Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This feature is under development. You'll soon be able to run queries, 
              visualize data, and export reports from this page.
            </p>
          </div>
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminDataExplorerPage;
