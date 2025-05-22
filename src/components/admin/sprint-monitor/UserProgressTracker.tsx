
import React, { useState } from 'react';
import { UserProgress } from '@/hooks/admin/useSprintMonitor';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Clock, X, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface UserProgressTrackerProps {
  userProgressData: UserProgress[];
  detailed?: boolean;
}

const UserProgressTracker: React.FC<UserProgressTrackerProps> = ({ userProgressData, detailed = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserProgress; direction: 'asc' | 'desc' }>({
    key: 'lastActivity',
    direction: 'desc'
  });

  if (!userProgressData || userProgressData.length === 0) {
    return <div className="text-center py-8 text-gray-500">No user progress data available</div>;
  }

  const toggleUserExpanded = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const sortData = (key: keyof UserProgress) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = userProgressData.filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === 'progressPercentage' || sortConfig.key === 'tasksCompleted') {
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    } else if (sortConfig.key === 'lastActivity') {
      return sortConfig.direction === 'asc'
        ? new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
        : new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    } else {
      // Handle the case when the key is userName or email (string type)
      const valueA = String(a[sortConfig.key]);
      const valueB = String(b[sortConfig.key]);
      
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {detailed && <TableHead className="w-10"></TableHead>}
            <TableHead 
              className="cursor-pointer"
              onClick={() => sortData('userName')}
            >
              User
              {sortConfig.key === 'userName' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => sortData('progressPercentage')}
            >
              Progress
              {sortConfig.key === 'progressPercentage' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => sortData('tasksCompleted')}
            >
              Tasks
              {sortConfig.key === 'tasksCompleted' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => sortData('lastActivity')}
            >
              Last Activity
              {sortConfig.key === 'lastActivity' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <React.Fragment key={user.userId}>
              <TableRow className="hover:bg-gray-50">
                {detailed && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleUserExpanded(user.userId)}
                      className="p-0 h-6 w-6"
                    >
                      {expandedUser === user.userId ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                )}
                <TableCell>
                  <div>
                    <div className="font-medium">{user.userName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={user.progressPercentage} className="h-2" />
                    <span className="text-sm">{Math.round(user.progressPercentage)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.tasksCompleted}</span>
                  <span className="text-gray-500">/{user.totalTasks}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(user.lastActivity).toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
              
              {detailed && expandedUser === user.userId && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-gray-50 p-0">
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-2">Task Progress</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Completed At</TableHead>
                            <TableHead>Time Spent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.taskProgress.map((task) => (
                            <TableRow key={task.taskId}>
                              <TableCell>{task.taskName}</TableCell>
                              <TableCell>
                                {task.status === 'completed' && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    <Check className="mr-1 h-3 w-3" />
                                    Completed
                                  </span>
                                )}
                                {task.status === 'in_progress' && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                    <Clock className="mr-1 h-3 w-3" />
                                    In Progress
                                  </span>
                                )}
                                {task.status === 'not_started' && (
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                    <X className="mr-1 h-3 w-3" />
                                    Not Started
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}
                              </TableCell>
                              <TableCell>
                                {task.timeSpent ? `${Math.round(task.timeSpent / (1000 * 60))} min` : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
