
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { TaskPerformanceData } from '@/hooks/admin/useSprintMonitor';

export interface TaskPerformanceMetricsProps {
  taskPerformance: TaskPerformanceData | null;
  isLoading?: boolean;
}

const TaskPerformanceMetrics: React.FC<TaskPerformanceMetricsProps> = ({ 
  taskPerformance, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!taskPerformance) {
    return (
      <div className="text-center py-6 text-gray-500">
        No task performance data available
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6B6B'];

  const completionData = [
    { name: 'Completed', value: taskPerformance.completedTasks },
    { name: 'Incomplete', value: taskPerformance.totalTasks - taskPerformance.completedTasks }
  ];

  // Prepare data for the task breakdown chart
  const taskBreakdownData = taskPerformance.taskBreakdown
    .slice(0, 10) // Limit to top 10 tasks
    .map(task => ({
      name: task.taskName.length > 20 ? task.taskName.substring(0, 20) + '...' : task.taskName,
      completions: task.completions,
      attempts: task.totalAttempts,
      averageTime: Math.round(task.averageTime)
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Total Tasks</div>
            <div className="text-3xl font-bold">{taskPerformance.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Completed Tasks</div>
            <div className="text-3xl font-bold">{taskPerformance.completedTasks}</div>
            <div className="text-sm text-gray-500">
              {taskPerformance.completionRate.toFixed(1)}% completion rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Avg. Completion Time</div>
            <div className="text-3xl font-bold">
              {taskPerformance.averageTimeToComplete.toFixed(1)} min
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Task Completion Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskBreakdownData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
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
                  <Bar dataKey="completions" fill="#4F46E5" name="Completions" />
                  <Bar dataKey="attempts" fill="#93C5FD" name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Completion Rate</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskPerformanceMetrics;
