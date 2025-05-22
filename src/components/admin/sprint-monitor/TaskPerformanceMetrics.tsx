
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TaskPerformanceMetricsProps {
  taskPerformance: any;
  detailed?: boolean;
}

const TaskPerformanceMetrics: React.FC<TaskPerformanceMetricsProps> = ({ 
  taskPerformance,
  detailed = false
}) => {
  if (!taskPerformance) {
    return (
      <div className="text-center py-6 text-gray-500">
        No task performance data available
      </div>
    );
  }

  const completionData = taskPerformance.taskBreakdown.map((task: any) => ({
    name: task.taskName.length > 20 ? task.taskName.substring(0, 20) + '...' : task.taskName,
    completions: task.completions,
    attempts: task.totalAttempts,
    averageTime: parseFloat(task.averageTime.toFixed(1)),
    abandonmentRate: parseFloat(task.abandonmentRate.toFixed(1)),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold">{taskPerformance.completedTasks}</div>
            <div className="text-sm text-gray-500">Completed Tasks</div>
            <Progress 
              value={(taskPerformance.completedTasks / taskPerformance.totalTasks) * 100} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold">{taskPerformance.completionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Task Completion Rate</div>
            <Progress 
              value={taskPerformance.completionRate} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold">{taskPerformance.averageTimeToComplete.toFixed(1)} min</div>
            <div className="text-sm text-gray-500">Avg. Completion Time</div>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <Tabs defaultValue="completions" className="w-full">
          <TabsList>
            <TabsTrigger value="completions">Completions</TabsTrigger>
            <TabsTrigger value="time">Avg. Time</TabsTrigger>
            <TabsTrigger value="abandonment">Abandonment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completions" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completions" fill="#4f46e5" name="Completions" />
                <Bar dataKey="attempts" fill="#93c5fd" name="Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="time" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageTime" fill="#10b981" name="Avg. Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="abandonment" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="abandonmentRate" fill="#f43f5e" name="Abandonment Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      )}

      <div className="space-y-2 mt-4">
        {!detailed && taskPerformance.taskBreakdown.slice(0, 5).map((task: any) => (
          <div key={task.taskId} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex-1">
              <div className="text-sm font-medium">{task.taskName}</div>
              <div className="text-xs text-gray-500">
                {task.completions} completions ({(task.completions / task.totalAttempts * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="text-sm font-medium">
              {task.averageTime.toFixed(1)} min
            </div>
          </div>
        ))}
        
        {detailed && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Task Breakdown</h3>
            <div className="space-y-4">
              {taskPerformance.taskBreakdown.map((task: any) => (
                <Card key={task.taskId}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h4 className="font-medium">{task.taskName}</h4>
                      <div className="text-sm text-gray-500">
                        ID: {task.taskId.substring(0, 8)}...
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-500">Attempts</div>
                        <div className="text-xl font-medium">{task.totalAttempts}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500">Completions</div>
                        <div className="text-xl font-medium">{task.completions}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500">Avg. Time</div>
                        <div className="text-xl font-medium">{task.averageTime.toFixed(1)} min</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500">Abandonment</div>
                        <div className="text-xl font-medium">{task.abandonmentRate.toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(task.completions / task.totalAttempts) * 100} 
                          className="h-2" 
                        />
                        <span className="text-sm">{((task.completions / task.totalAttempts) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPerformanceMetrics;
