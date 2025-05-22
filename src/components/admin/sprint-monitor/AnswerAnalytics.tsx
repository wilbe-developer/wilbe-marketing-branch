
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSprintMonitor } from '@/hooks/admin/useSprintMonitor';
import { supabase } from '@/integrations/supabase/client';

interface AnswerAnalyticsProps {
  // Props if needed
}

const AnswerAnalytics: React.FC<AnswerAnalyticsProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<any[]>([]);
  const [taskDefinitions, setTaskDefinitions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch task definitions
        const { data: tasksData, error: tasksError } = await supabase
          .from('sprint_task_definitions')
          .select('*');
          
        if (tasksError) throw tasksError;
        
        // Fetch answers data
        const { data: progressData, error: progressError } = await supabase
          .from('user_sprint_progress')
          .select('*, sprint_profiles(name, email)')
          .not('answers', 'is', null);
          
        if (progressError) throw progressError;
        
        // Process data
        const processedAnswers = progressData.map(item => {
          const taskDef = tasksData?.find(t => t.id === item.task_id);
          
          // Helper function to extract task name
          const extractTaskName = (definition: any) => {
            if (!definition) return 'Unknown Task';
            
            if (typeof definition === 'object' && definition.taskName) {
              return definition.taskName;
            } else if (typeof definition === 'string') {
              try {
                const parsed = JSON.parse(definition);
                return parsed.taskName || 'Unknown Task';
              } catch (e) {
                return 'Unknown Task';
              }
            }
            
            return 'Unknown Task';
          };
          
          return {
            id: item.id,
            userId: item.user_id,
            userName: item.sprint_profiles?.name || 'Unknown User',
            userEmail: item.sprint_profiles?.email || 'No Email',
            taskId: item.task_id,
            taskName: taskDef ? extractTaskName(taskDef.definition) : 'Unknown Task',
            answers: item.answers || {},
            completed: item.completed,
            completedAt: item.completed_at,
            createdAt: item.created_at
          };
        });
        
        setAnswers(processedAnswers);
        setTaskDefinitions(tasksData || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching answer data:', err);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter answers based on search term and selected task
  const filteredAnswers = answers.filter(answer => {
    const matchesSearch = 
      (answer.userName && answer.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (answer.userEmail && answer.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (answer.taskName && answer.taskName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesTask = selectedTask ? answer.taskId === selectedTask : true;
    
    return matchesSearch && matchesTask;
  });
  
  // Helper function to render answer content based on type
  const renderAnswerContent = (content: any) => {
    if (!content) return 'No answer provided';
    
    if (Array.isArray(content)) {
      return content.join(', ');
    } else if (typeof content === 'object') {
      return JSON.stringify(content);
    } else {
      return String(content);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by user or task..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-3 py-2 border rounded-md"
          value={selectedTask || ''}
          onChange={(e) => setSelectedTask(e.target.value || null)}
        >
          <option value="">All Tasks</option>
          {taskDefinitions.map(task => {
            // Helper function to extract task name
            const extractTaskName = (definition: any) => {
              if (!definition) return 'Unknown Task';
              
              if (typeof definition === 'object' && definition.taskName) {
                return definition.taskName;
              } else if (typeof definition === 'string') {
                try {
                  const parsed = JSON.parse(definition);
                  return parsed.taskName || 'Unknown Task';
                } catch (e) {
                  return 'Unknown Task';
                }
              }
              
              return 'Unknown Task';
            };
            
            return (
              <option key={task.id} value={task.id}>
                {extractTaskName(task.definition)}
              </option>
            );
          })}
        </select>
      </div>
      
      {/* Answer Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAnswers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Answers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnswers.map((answer) => (
                  <TableRow key={answer.id}>
                    <TableCell>
                      <div className="font-medium">{answer.userName}</div>
                      <div className="text-xs text-gray-500">{answer.userEmail}</div>
                    </TableCell>
                    <TableCell>{answer.taskName}</TableCell>
                    <TableCell>
                      {answer.completedAt ? new Date(answer.completedAt).toLocaleDateString() : 'Not completed'}
                    </TableCell>
                    <TableCell>
                      <details className="text-sm">
                        <summary className="cursor-pointer">View Answers</summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded border text-xs whitespace-pre-wrap">
                          {Object.entries(answer.answers || {}).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium">{key}: </span>
                              <span>{renderAnswerContent(value)}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No answers found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Answer Statistics - Placeholder for future implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Answer analytics visualization will be implemented in a future update
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnswerAnalytics;
