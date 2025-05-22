
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';

const AdminActivityLogPage = () => {
  const { activityFeed, isLoading } = useSprintMonitor();

  return (
    <FullScreenAdminLayout title="Activity Log">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-gray-500 mt-2">View system and user activity</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : activityFeed && activityFeed.length > 0 ? (
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{activity.details}</p>
                    {activity.taskName && (
                      <p className="text-xs text-gray-500 mt-1">Task: {activity.taskName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No activity records found</div>
          )}
        </CardContent>
      </Card>
    </FullScreenAdminLayout>
  );
};

export default AdminActivityLogPage;
