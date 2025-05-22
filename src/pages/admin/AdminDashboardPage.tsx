
import React, { useEffect } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSprintAdminData } from '@/hooks/admin/useSprintAdminData';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { BarChart, Users, FileText, Settings, Clock, Database, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { unifiedStats, refreshData } = useSprintAdminData();
  const { taskPerformance, activityFeed, refreshMonitorData } = useSprintMonitor();

  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
    refreshMonitorData();
  }, []);

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
              <span className="text-2xl font-bold">{unifiedStats?.sprintSignups || '...'}</span>
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
              <span className="text-2xl font-bold">{unifiedStats?.waitlistSignups || '...'}</span>
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
                {unifiedStats ? `${unifiedStats.conversionRate.toFixed(1)}%` : '...'}
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
              <span className="text-2xl font-bold">{taskPerformance?.totalTasks || '...'}</span>
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
              
              <Link to="/admin/data-explorer" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Data Explorer</div>
                    <div className="text-sm text-gray-500">Explore and analyze sprint data</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/activity" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Activity Log</div>
                    <div className="text-sm text-gray-500">View system and user activity</div>
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
          <CardContent className="max-h-[300px] overflow-auto">
            {activityFeed && activityFeed.length > 0 ? (
              <div className="space-y-3">
                {activityFeed.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-xs text-gray-500">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link to="/admin/activity" className="text-sm text-blue-600 hover:underline">
                    View all activity
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent activity to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FullScreenAdminLayout>
  );
};

export default AdminDashboardPage;
