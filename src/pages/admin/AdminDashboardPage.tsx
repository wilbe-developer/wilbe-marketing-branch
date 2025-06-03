import React, { useEffect, useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSprintAdminData } from '@/hooks/admin/useSprintAdminData';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { BarChart, Users, FileText, Settings, Clock, Database, Activity, BarChart2, LineChart, TrendingUp, UserCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ActivityFeed from '@/components/admin/sprint-monitor/ActivityFeed';

const AdminDashboardPage = () => {
  const { unifiedStats, refreshData, getSignupsByDate } = useSprintAdminData();
  const { taskPerformance, activityFeed, refreshMonitorData } = useSprintMonitor();
  const [signupData, setSignupData] = useState<any[]>([]);
  
  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
    refreshMonitorData();
  }, []);

  // Get signup data for charts when unifiedStats changes
  useEffect(() => {
    if (unifiedStats) {
      const data = getSignupsByDate('all', 14);
      setSignupData(data);
    }
  }, [unifiedStats]);

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
              <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Signup Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={signupData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWaitlist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSprint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="waitlist" stroke="#8884d8" fillOpacity={1} fill="url(#colorWaitlist)" />
                  <Area type="monotone" dataKey="sprint" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSprint)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto">
            <ActivityFeed activityFeed={activityFeed || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Navigation</CardTitle>
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
              
              <Link to="/admin/approvals" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">User Approvals</div>
                    <div className="text-sm text-gray-500">Review and approve user registrations</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/roles" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Role Management</div>
                    <div className="text-sm text-gray-500">Manage user roles and permissions</div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/sprint-monitor" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">BSF Monitor</div>
                    <div className="text-sm text-gray-500">View BSF progress and analytics</div>
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
              
              <Link to="/admin/utm-analytics" className="block p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">UTM Analytics</div>
                    <div className="text-sm text-gray-500">Track marketing campaign performance</div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {taskPerformance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="text-sm text-gray-500">Completion Rate</div>
                    <div className="text-2xl font-bold">{taskPerformance.completionRate.toFixed(1)}%</div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="text-sm text-gray-500">Avg. Time</div>
                    <div className="text-2xl font-bold">{taskPerformance.averageTimeToComplete.toFixed(1)} min</div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-2">Top Performing Tasks</div>
                  <div className="space-y-2">
                    {taskPerformance.taskBreakdown
                      .sort((a: any, b: any) => b.completions - a.completions)
                      .slice(0, 3)
                      .map((task: any) => (
                        <div key={task.taskId} className="flex justify-between items-center">
                          <div className="text-sm truncate" style={{ maxWidth: '70%' }}>{task.taskName}</div>
                          <div className="text-sm font-medium">{task.completions} completions</div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <Link to="/admin/sprint-monitor" className="text-sm text-blue-600 hover:underline">
                    View detailed analytics
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FullScreenAdminLayout>
  );
};

export default AdminDashboardPage;
