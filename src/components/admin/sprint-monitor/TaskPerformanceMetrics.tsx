
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface TaskPerformanceMetricsProps {
  taskPerformance: any;
  detailed?: boolean;
}

const TaskPerformanceMetrics: React.FC<TaskPerformanceMetricsProps> = ({ 
  taskPerformance, 
  detailed = false 
}) => {
  const [sortBy, setSortBy] = useState<'completions' | 'abandonmentRate' | 'averageTime'>('completions');
  
  if (!taskPerformance) {
    return (
      <div className="text-center py-6 text-gray-500">
        No task performance data available
      </div>
    );
  }

  // Calculate completion rate percentage for summary view
  const completionRate = taskPerformance.completionRate || 0;
  const averageTime = taskPerformance.averageTimeToComplete || 0;
  
  // Sort task breakdown based on selected criteria
  const sortedTasks = [...(taskPerformance.taskBreakdown || [])].sort((a, b) => {
    if (sortBy === 'completions') return b.completions - a.completions;
    if (sortBy === 'abandonmentRate') return b.abandonmentRate - a.abandonmentRate;
    return b.averageTime - a.averageTime;
  });

  // Prepare data for bar chart
  const chartData = sortedTasks.map(task => ({
    name: task.taskName?.length > 20 ? `${task.taskName.substring(0, 20)}...` : task.taskName,
    completions: task.completions,
    attempts: task.totalAttempts,
    averageTime: parseFloat(task.averageTime.toFixed(1))
  }));

  return (
    <div className="space-y-4">
      {!detailed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Completion Rate</div>
              <div className="text-2xl font-bold mt-1">{completionRate.toFixed(1)}%</div>
              <Progress value={completionRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Avg. Completion Time</div>
              <div className="flex items-center mt-1">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-2xl font-bold">{averageTime.toFixed(1)} min</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Tasks Completed</div>
              <div className="flex items-center mt-1">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">
                  {taskPerformance.completedTasks} / {taskPerformance.totalTasks}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {detailed && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completions" name="Completions" fill="#82ca9d">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.completions > entry.attempts / 2 ? '#82ca9d' : '#ff8042'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Task Performance Details</div>
          <div className="flex space-x-2 text-xs">
            <button 
              className={`px-2 py-1 rounded ${sortBy === 'completions' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSortBy('completions')}
            >
              By Completions
            </button>
            <button 
              className={`px-2 py-1 rounded ${sortBy === 'averageTime' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSortBy('averageTime')}
            >
              By Time
            </button>
            <button 
              className={`px-2 py-1 rounded ${sortBy === 'abandonmentRate' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSortBy('abandonmentRate')}
            >
              By Abandonment
            </button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Completions</TableHead>
              <TableHead>Avg. Time</TableHead>
              <TableHead>Abandonment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{task.completions}/{task.totalAttempts}</span>
                    <Progress 
                      value={task.totalAttempts > 0 ? (task.completions / task.totalAttempts) * 100 : 0} 
                      className="h-2 w-16"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-gray-400" />
                    <span>{task.averageTime.toFixed(1)} min</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {task.abandonmentRate > 50 && (
                      <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
                    )}
                    <span className={task.abandonmentRate > 50 ? 'text-amber-500' : ''}>
                      {task.abandonmentRate.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskPerformanceMetrics;
