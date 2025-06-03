
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, Users, CheckCircle, Clock } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAdminFilter } from '@/hooks/admin/useAdminFilter';

const SprintControlRoom = () => {
  const { 
    userProgressData, 
    taskPerformance, 
    activityFeed, 
    isLoading: isLoadingMonitor, 
    refreshMonitorData 
  } = useSprintMonitor();
  
  const { adminUserIds, isLoading: isLoadingAdmins } = useAdminFilter();
  const isLoading = isLoadingMonitor || isLoadingAdmins;
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMonitorData();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Filter out admin users from user progress data
  const filteredUserProgressData = userProgressData?.filter(user => 
    !adminUserIds.includes(user.userId)
  ) || [];
  
  // Calculate summary stats (excluding admin users)
  const totalUsers = filteredUserProgressData.length;
  const activeUsers = filteredUserProgressData.filter(u => u.tasksCompleted > 0).length || 0;
  const completionRate = taskPerformance?.completionRate || 0;
  const avgTimeToComplete = taskPerformance?.averageTimeToComplete || 0;
  
  // Chart data
  const taskCompletionData = taskPerformance?.taskBreakdown?.map(task => ({
    name: task.taskName.length > 15 ? task.taskName.substring(0, 15) + '...' : task.taskName,
    completed: task.completions,
    attempted: task.totalAttempts
  })) || [];
  
  // User progress distribution (excluding admin users)
  const progressDistribution = [
    { name: 'No Tasks', value: totalUsers - activeUsers },
    { name: 'In Progress', value: activeUsers - (filteredUserProgressData.filter(u => u.progressPercentage === 100).length || 0) },
    { name: 'Completed', value: filteredUserProgressData.filter(u => u.progressPercentage === 100).length || 0 }
  ];
  
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F'];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Show the total number of admin users excluded from stats
  const adminUsersCount = adminUserIds.length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">BSF Overview</h2>
          <div className="text-sm text-muted-foreground">
            Showing statistics for non-admin users only ({adminUsersCount} admin users excluded from calculations)
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCcw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers} <span className="text-sm text-muted-foreground">({Math.round((activeUsers / totalUsers) * 100) || 0}%)</span></p>
              </div>
              <Users className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Task Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
                <p className="text-2xl font-bold">{Math.round(avgTimeToComplete)} <span className="text-sm text-muted-foreground">min</span></p>
              </div>
              <Clock className="h-8 w-8 text-orange-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskCompletionData.slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attempted" fill="#8884d8" name="Attempted" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {progressDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} users`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityFeed.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 border-b pb-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.userName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.eventType === 'signup' && 'Signed up for BSF'}
                    {activity.eventType === 'task_completed' && `Completed task: ${activity.taskName}`}
                    {activity.eventType === 'file_uploaded' && `Uploaded file for: ${activity.taskName}`}
                    {activity.eventType === 'profile_updated' && 'Updated profile information'}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Badge>
                </div>
                <div>
                  {activity.eventType === 'signup' && (
                    <Badge>New User</Badge>
                  )}
                  {activity.eventType === 'task_completed' && (
                    <Badge variant="success">Task Complete</Badge>
                  )}
                  {activity.eventType === 'file_uploaded' && (
                    <Badge variant="info">File Upload</Badge>
                  )}
                  {activity.eventType === 'profile_updated' && (
                    <Badge variant="warning">Profile Update</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {activityFeed.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity to display
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintControlRoom;
