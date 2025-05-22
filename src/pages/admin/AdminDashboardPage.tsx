
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSprintAdminData } from '@/hooks/admin/useSprintAdminData';
import { BarChart, Users, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { unifiedStats, isLoading } = useSprintAdminData();

  return (
    <FullScreenAdminLayout title="Admin Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to the Wilbe Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{isLoading ? '...' : unifiedStats.sprintSignups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Waitlist Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{isLoading ? '...' : unifiedStats.waitlistSignups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">
                {isLoading ? '...' : `${unifiedStats.conversionRate.toFixed(1)}%`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">...</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/users" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">User Management</div>
                    <div className="text-sm text-gray-500">Manage user accounts and permissions</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/sprint-monitor" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Sprint Monitor</div>
                    <div className="text-sm text-gray-500">View sprint progress and analytics</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/task-builder" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Task Builder</div>
                    <div className="text-sm text-gray-500">Create and manage sprint tasks</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/settings" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className="text-sm text-gray-500">Configure platform settings</div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Activity data will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </FullScreenAdminLayout>
  );
};

export default AdminDashboardPage;
