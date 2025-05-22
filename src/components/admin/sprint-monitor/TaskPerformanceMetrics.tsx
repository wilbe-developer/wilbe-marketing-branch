
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, CheckSquare, Clock, ArrowUpDown, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskBreakdown {
  taskId: string;
  taskName: string;
  totalAttempts: number;
  completions: number;
  averageTime: number;
  abandonmentRate: number;
}

interface TaskPerformanceData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTimeToComplete: number;
  completedToday: number;
  taskBreakdown: TaskBreakdown[];
}

interface TaskPerformanceMetricsProps {
  taskPerformance: TaskPerformanceData | null;
  detailed?: boolean;
}

const TaskPerformanceMetrics: React.FC<TaskPerformanceMetricsProps> = ({ 
  taskPerformance, 
  detailed = false 
}) => {
  const [sortField, setSortField] = useState<keyof TaskBreakdown>('completions');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  if (!taskPerformance) {
    return (
      <div className="text-center py-6 text-gray-500">
        No task performance data available
      </div>
    );
  }

  const sortTasks = (tasks: TaskBreakdown[]) => {
    return [...tasks].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const toggleSort = (field: keyof TaskBreakdown) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) {
      return 'Less than a minute';
    }
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hr ${remainingMinutes} min`;
  };

  const sortedTasks = sortTasks(taskPerformance.taskBreakdown);

  // For basic view, only show top 5 tasks
  const displayTasks = detailed ? sortedTasks : sortedTasks.slice(0, 5);

  return (
    <div className="space-y-4">
      {!detailed && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <CheckSquare className="h-4 w-4 text-gray-500 mr-1" />
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
            <div className="text-2xl font-bold">
              {taskPerformance.completionRate.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <Clock className="h-4 w-4 text-gray-500 mr-1" />
              <div className="text-sm text-gray-500">Avg. Time</div>
            </div>
            <div className="text-2xl font-bold">
              {formatDuration(taskPerformance.averageTimeToComplete)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <BarChart className="h-4 w-4 text-gray-500 mr-1" />
              <div className="text-sm text-gray-500">Completed Tasks</div>
            </div>
            <div className="text-2xl font-bold">
              {taskPerformance.completedTasks}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <CheckSquare className="h-4 w-4 text-gray-500 mr-1" />
              <div className="text-sm text-gray-500">Completed Today</div>
            </div>
            <div className="text-2xl font-bold">
              {taskPerformance.completedToday}
            </div>
          </div>
        </div>
      )}
      
      {detailed && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Task Performance Analysis</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary" 
              onClick={() => toggleSort('completions')}
            >
              <div className="flex items-center">
                Completions
                {sortField === 'completions' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary" 
              onClick={() => toggleSort('averageTime')}
            >
              <div className="flex items-center">
                Avg. Time
                {sortField === 'averageTime' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary" 
              onClick={() => toggleSort('abandonmentRate')}
            >
              <div className="flex items-center">
                Abandonment
                {sortField === 'abandonmentRate' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTasks.map((task) => (
            <React.Fragment key={task.taskId}>
              <TableRow 
                className={`${expandedTask === task.taskId ? 'border-b-0' : ''} ${detailed ? 'cursor-pointer' : ''}`}
                onClick={() => detailed && toggleTaskExpand(task.taskId)}
              >
                <TableCell>
                  <div className="font-medium truncate max-w-[250px]" title={task.taskName}>
                    {task.taskName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{task.completions}/{task.totalAttempts}</span>
                    <Badge variant={task.completions > 0 ? "success" : "outline"}>
                      {Math.round((task.completions / (task.totalAttempts || 1)) * 100)}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {task.averageTime > 0 ? (
                    formatDuration(task.averageTime)
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={task.abandonmentRate} 
                      className="h-2 w-20" 
                    />
                    <span>{task.abandonmentRate.toFixed(0)}%</span>
                  </div>
                </TableCell>
              </TableRow>
              
              {detailed && expandedTask === task.taskId && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={4} className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Task Details</h4>
                        <p className="text-sm text-gray-700">{task.taskName}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                            <div className="text-xl font-bold">
                              {Math.round((task.completions / (task.totalAttempts || 1)) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {task.completions} out of {task.totalAttempts} attempts
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Average Time</div>
                            <div className="text-xl font-bold">
                              {task.averageTime > 0 ? formatDuration(task.averageTime) : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {task.completions} completed attempts
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Abandonment Rate</div>
                            <div className="text-xl font-bold">
                              {task.abandonmentRate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {task.totalAttempts - task.completions} abandoned attempts
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      
      {!detailed && taskPerformance.taskBreakdown.length > 5 && (
        <div className="text-center">
          <Button variant="link" size="sm">
            View all {taskPerformance.taskBreakdown.length} tasks
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskPerformanceMetrics;
