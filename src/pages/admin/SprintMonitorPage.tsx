
import React, { useState, useEffect, useCallback } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSprintAdminData } from '@/hooks/useSprintAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users, Clock, FileText, Filter, Download, Activity } from 'lucide-react';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { useRealTimeUpdates } from '@/hooks/admin/useRealTimeUpdates';
import UserProgressTracker from '@/components/admin/sprint-monitor/UserProgressTracker';
import ActivityFeed from '@/components/admin/sprint-monitor/ActivityFeed';
import AnswerAnalytics from '@/components/admin/sprint-monitor/AnswerAnalytics';
import FileRepository from '@/components/admin/sprint-monitor/FileRepository';
import TaskPerformanceMetrics from '@/components/admin/sprint-monitor/TaskPerformanceMetrics';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const SprintMonitorPage = () => {
  const { refreshData, unifiedStats, isLoading: statsLoading } = useSprintAdminData();
  const { 
    userProgressData, 
    activityFeed, 
    taskPerformance, 
    refreshMonitorData, 
    isLoading: monitorLoading 
  } = useSprintMonitor();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Use callback to avoid dependency issues with useEffect
  const handleRefresh = useCallback(() => {
    refreshData();
    refreshMonitorData();
    toast.success("Data refreshed successfully");
  }, [refreshData, refreshMonitorData]);

  // Initialize real-time updates
  const { isConnected } = useRealTimeUpdates(realTimeEnabled, handleRefresh);

  const toggleRealTime = () => {
    setRealTimeEnabled(!realTimeEnabled);
    if (!realTimeEnabled) {
      toast.info("Enabling real-time updates...");
    } else {
      toast.info("Disabling real-time updates");
    }
  };

  // Function to export data as CSV
  const exportData = (dataType: string) => {
    let csvContent = "";
    let filename = "";
    
    // Different export formats based on active tab
    if (dataType === 'users') {
      csvContent = "User ID,Name,Email,Tasks Completed,Progress %,Last Activity\n";
      userProgressData.forEach(user => {
        csvContent += `${user.userId},"${user.userName}","${user.email}",${user.tasksCompleted},${user.progressPercentage.toFixed(1)},${user.lastActivity}\n`;
      });
      filename = "user-progress-export.csv";
    } else if (dataType === 'tasks') {
      csvContent = "Task ID,Task Name,Completions,Average Time (min),Abandonment Rate\n";
      taskPerformance?.taskBreakdown.forEach(task => {
        csvContent += `${task.taskId},"${task.taskName}",${task.completions},${task.averageTime.toFixed(1)},${task.abandonmentRate.toFixed(1)}\n`;
      });
      filename = "task-performance-export.csv";
    }
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Data exported as ${filename}`);
  };

  const isLoading = statsLoading || monitorLoading;

  return (
    <FullScreenAdminLayout title="Sprint Monitoring Dashboard">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sprint Control Room</h1>
        <div className="flex gap-2">
          <Button 
            variant={realTimeEnabled ? "default" : "outline"} 
            onClick={toggleRealTime} 
            className="flex items-center gap-2"
          >
            <Activity size={16} />
            {realTimeEnabled ? 
              <>
                Real-time {isConnected ? 
                  <Badge variant="success" className="ml-1">Connected</Badge> : 
                  <Badge variant="warning" className="ml-1">Connecting...</Badge>
                }
              </> : 
              "Enable Real-time"
            }
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{isLoading ? '...' : unifiedStats?.sprintSignups || 0}</span>
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
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Progress</TabsTrigger>
            <TabsTrigger value="tasks">Task Performance</TabsTrigger>
            <TabsTrigger value="answers">Answer Analytics</TabsTrigger>
            <TabsTrigger value="files">File Repository</TabsTrigger>
          </TabsList>
          
          {/* Add export functionality */}
          {(activeTab === 'users' || activeTab === 'tasks') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportData(activeTab)}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export {activeTab === 'users' ? 'User Data' : 'Task Data'}
            </Button>
          )}
        </div>
        
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detailed User Progress</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="min-h-[600px]">
              <UserProgressTracker userProgressData={userProgressData} detailed />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task Performance Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
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
