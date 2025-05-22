import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Mail } from 'lucide-react';

export interface UserProgressTrackerProps {
  userProgressData: any[];
  isLoading?: boolean;
  detailed?: boolean;
}

const UserProgressTracker: React.FC<UserProgressTrackerProps> = ({ userProgressData, isLoading = false, detailed = false }) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!userProgressData || userProgressData.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No user progress data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Last Activity</TableHead>
            {detailed && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProgressData.map((user) => (
            <React.Fragment key={user.userId}>
              <TableRow 
                className={`${expandedUser === user.userId ? 'border-b-0' : ''} cursor-pointer`}
                onClick={() => detailed && toggleUserExpand(user.userId)}
              >
                <TableCell>
                  <div className="font-medium">{user.userName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </TableCell>
                <TableCell>
                  <div className="w-full flex items-center space-x-2">
                    <Progress value={user.progressPercentage} className="h-2" />
                    <span className="text-xs whitespace-nowrap">{user.progressPercentage.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.tasksCompleted} / {user.totalTasks}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-gray-400" />
                    <span className="text-xs">{new Date(user.lastActivity).toLocaleString()}</span>
                  </div>
                </TableCell>
                {detailed && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
              
              {detailed && expandedUser === user.userId && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={5} className="p-4">
                    <div className="text-sm font-medium mb-2">Task Progress</div>
                    <div className="space-y-2">
                      {user.taskProgress.map((task: any) => (
                        <div key={task.taskId} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm">{task.taskName}</div>
                            <div className="text-xs text-gray-500">
                              {task.status === 'completed' 
                                ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
                                : task.status === 'in_progress' 
                                  ? 'In progress'
                                  : 'Not started'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === 'completed' 
                                ? 'bg-green-500' 
                                : task.status === 'in_progress'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserProgressTracker;
