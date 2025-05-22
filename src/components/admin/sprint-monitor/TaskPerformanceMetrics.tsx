
import React from 'react';
import { TaskPerformanceData } from '@/hooks/admin/useSprintMonitor';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TaskPerformanceMetricsProps {
  taskPerformance: TaskPerformanceData | null;
  detailed?: boolean;
}

const TaskPerformanceMetrics: React.FC<TaskPerformanceMetricsProps> = ({ taskPerformance, detailed = false }) => {
  if (!taskPerformance) {
    return <div className="text-center py-8 text-gray-500">No task performance data available</div>;
  }

  // Prepare data for the chart
  const chartData = taskPerformance.taskBreakdown.map(task => ({
    name: task.taskName.length > 20 ? `${task.taskName.substring(0, 20)}...` : task.taskName,
    completions: task.completions,
    attempts: task.totalAttempts,
    abandonment: Math.round(task.abandonmentRate)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{taskPerformance.completionRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-500">Overall Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{taskPerformance.averageTimeToComplete.toFixed(1)} min</div>
            <p className="text-sm text-gray-500">Avg. Time to Complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{taskPerformance.completedTasks}/{taskPerformance.totalTasks}</div>
            <p className="text-sm text-gray-500">Tasks Completed</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Task Performance</h3>
        </div>
        <div className="p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completions" fill="#10b981" name="Completions" />
              <Bar dataKey="attempts" fill="#6366f1" name="Attempts" />
              <Bar dataKey="abandonment" fill="#f43f5e" name="Abandonment %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {detailed && (
        <div>
          <h3 className="text-lg font-medium mb-4">Detailed Task Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Completions</TableHead>
                <TableHead>Avg. Time (min)</TableHead>
                <TableHead>Abandonment Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskPerformance.taskBreakdown.map((task) => (
                <TableRow key={task.taskId}>
                  <TableCell className="font-medium">{task.taskName}</TableCell>
                  <TableCell>{task.totalAttempts}</TableCell>
                  <TableCell>{task.completions}</TableCell>
                  <TableCell>{task.averageTime.toFixed(1)}</TableCell>
                  <TableCell>{task.abandonmentRate.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TaskPerformanceMetrics;
