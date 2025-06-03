
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProgressTracker from '@/components/admin/sprint-monitor/UserProgressTracker';
import TaskPerformanceMetrics from '@/components/admin/sprint-monitor/TaskPerformanceMetrics';
import ActivityFeed from '@/components/admin/sprint-monitor/ActivityFeed';
import FileRepository from '@/components/admin/sprint-monitor/FileRepository';
import TaskAnswersTab from '@/components/admin/sprint-monitor/TaskAnswersTab';
import SprintProfilesTab from '@/components/admin/sprint-monitor/SprintProfilesTab';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRealTimeUpdates } from '@/hooks/admin/useRealTimeUpdates';
import SprintControlRoom from '@/components/admin/sprint-monitor/SprintControlRoom';

const SprintMonitorPage = () => {
  const { 
    userProgressData, 
    activityFeed, 
    taskPerformance, 
    isLoading, 
    refreshMonitorData 
  } = useSprintMonitor();
  
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  
  // Enable real-time updates
  const { isConnected } = useRealTimeUpdates(realtimeEnabled, refreshMonitorData);

  return (
    <FullScreenAdminLayout title="BSF Monitor">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">BSF Monitor</h1>
          <p className="text-gray-500 mt-2">Monitor BSF progress and user activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="realtime" 
            checked={realtimeEnabled} 
            onCheckedChange={setRealtimeEnabled} 
          />
          <Label htmlFor="realtime" className="cursor-pointer">
            <div className="flex flex-col">
              <span>Real-time updates</span>
              <span className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </Label>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="progress">User Progress</TabsTrigger>
          <TabsTrigger value="answers">Task Answers</TabsTrigger>
          <TabsTrigger value="tasks">Task Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="files">File Repository</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>BSF Control Room</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintControlRoom />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>BSF Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintProfilesTab />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>User Progress Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProgressTracker 
                userProgressData={userProgressData} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>Task Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskAnswersTab />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskPerformanceMetrics 
                taskPerformance={taskPerformance} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed 
                activityFeed={activityFeed} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>File Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <FileRepository 
                isLoading={isLoading} 
                refreshData={refreshMonitorData} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FullScreenAdminLayout>
  );
};

export default SprintMonitorPage;
