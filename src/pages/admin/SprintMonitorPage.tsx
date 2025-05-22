
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSprintAdminData } from '@/hooks/useSprintAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users, Clock, FileText, Filter } from 'lucide-react';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import UserProgressTracker from '@/components/admin/sprint-monitor/UserProgressTracker';
import ActivityFeed from '@/components/admin/sprint-monitor/ActivityFeed';
import AnswerAnalytics from '@/components/admin/sprint-monitor/AnswerAnalytics';
import FileRepository from '@/components/admin/sprint-monitor/FileRepository';
import TaskPerformanceMetrics from '@/components/admin/sprint-monitor/TaskPerformanceMetrics';

const SprintMonitorPage = () => {
  const { refreshData, unifiedStats, isLoading } = useSprintAdminData();
  const { userProgressData, activityFeed, taskPerformance, refreshMonitorData } = useSprintMonitor();
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = () => {
    refreshData();
    refreshMonitorData();
  };

  return (
    <FullScreenAdminLayout title="Sprint Monitoring Dashboard">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sprint Control Room</h1>
        <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCcw size={16} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-500">Tasks Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{isLoading ? '...' : taskPerformance?.completedToday || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Last Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">
                {isLoading ? '...' : activityFeed && activityFeed.length > 0 
                  ? new Date(activityFeed[0].timestamp).toLocaleTimeString() 
                  : 'No activity'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Progress</TabsTrigger>
          <TabsTrigger value="tasks">Task Performance</TabsTrigger>
          <TabsTrigger value="answers">Answer Analytics</TabsTrigger>
          <TabsTrigger value="files">File Repository</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Real-Time Activity Feed</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <ActivityFeed activityFeed={activityFeed} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] overflow-auto">
                <UserProgressTracker userProgressData={userProgressData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] overflow-auto">
                <TaskPerformanceMetrics taskPerformance={taskPerformance} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Detailed User Progress</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <UserProgressTracker userProgressData={userProgressData} detailed />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <TaskPerformanceMetrics taskPerformance={taskPerformance} detailed />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>User Answer Analytics</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <AnswerAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>File Repository</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <FileRepository />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FullScreenAdminLayout>
  );
};

export default SprintMonitorPage;
