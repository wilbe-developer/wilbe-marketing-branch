
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface TaskAnswersTabProps {
  // Props if needed
}

const TaskAnswersTab: React.FC<TaskAnswersTabProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<any[]>([]);
  const [taskDefinitions, setTaskDefinitions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch task definitions
      const { data: tasksData, error: tasksError } = await supabase
        .from('sprint_task_definitions')
        .select('*');
        
      if (tasksError) throw tasksError;
      
      // Fetch sprint profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('sprint_profiles')
        .select('user_id, name, email');
        
      if (profilesError) throw profilesError;
      
      // Create a map of user_id to profile info
      const profileMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profileMap.set(profile.user_id, {
            name: profile.name || 'Unknown User',
            email: profile.email || 'No Email'
          });
        });
      }
      
      // Fetch answers data - IMPORTANT: Remove the filter condition for answers
      // to get all progress records, including ones with task_answers
      const { data: progressData, error: progressError } = await supabase
        .from('user_sprint_progress')
        .select('*');
        
      if (progressError) throw progressError;
      
      // Filter records with task_answers after fetching
      const progressWithAnswers = progressData.filter(item => 
        item.task_answers !== null || item.answers !== null
      );
      
      // Process data
      const processedAnswers = progressWithAnswers.map(item => {
        const taskDef = tasksData?.find(t => t.id === item.task_id);
        const userProfile = profileMap.get(item.user_id) || { name: 'Unknown User', email: 'No Email' };
        
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
          userName: userProfile.name,
          userEmail: userProfile.email,
          taskId: item.task_id,
          taskName: taskDef ? extractTaskName(taskDef.definition) : 'Unknown Task',
          answers: typeof item.answers === 'string' ? JSON.parse(item.answers) : (item.answers || {}),
          taskAnswers: typeof item.task_answers === 'string' ? JSON.parse(item.task_answers) : (item.task_answers || {}),
          completed: item.completed,
          completedAt: item.completed_at,
          createdAt: item.created_at,
          fileId: item.file_id
        };
      });
      
      console.log('Processed answers:', processedAnswers);
      
      setAnswers(processedAnswers);
      setTaskDefinitions(tasksData || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching answer data:', err);
      toast.error('Failed to load task answers');
      setIsLoading(false);
    }
  };
  
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
                  <TableHead>Status</TableHead>
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
                      {answer.completed ? (
                        <Badge variant="success">Completed</Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {answer.completedAt ? new Date(answer.completedAt).toLocaleDateString() : 'Not completed'}
                      </div>
                      {answer.fileId && (
                        <div className="flex items-center text-xs text-blue-500 mt-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Has file attachment
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <details className="text-sm">
                        <summary className="cursor-pointer">View Answers</summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded border text-xs whitespace-pre-wrap">
                          {Object.keys(answer.answers || {}).length > 0 ? (
                            Object.entries(answer.answers || {}).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <span className="font-medium">{key}: </span>
                                <span>{renderAnswerContent(value)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500">No standard answers recorded</div>
                          )}
                          
                          {Object.keys(answer.taskAnswers || {}).length > 0 ? (
                            <>
                              <div className="mt-2 mb-1 font-medium text-gray-700">Task Answers:</div>
                              {Object.entries(answer.taskAnswers || {}).map(([key, value]) => (
                                <div key={key} className="mb-1">
                                  <span className="font-medium">{key}: </span>
                                  <span>{renderAnswerContent(value)}</span>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-gray-500 mt-2">No task answers recorded</div>
                          )}
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
      
      {/* Answer Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Total Responses</div>
              <div className="text-2xl font-bold">{answers.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Completed Tasks</div>
              <div className="text-2xl font-bold">
                {answers.filter(a => a.completed).length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Response Rate</div>
              <div className="text-2xl font-bold">
                {answers.length > 0 
                  ? `${Math.round((answers.filter(a => a.completed).length / answers.length) * 100)}%` 
                  : '0%'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAnswersTab;
