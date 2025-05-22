
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskAnswer {
  taskId: string;
  taskName: string;
  answers: Record<string, any>[];
}

const AnswerAnalytics = () => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [tasks, setTasks] = useState<{id: string, title: string}[]>([]);
  const [answers, setAnswers] = useState<TaskAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasksAndAnswers = async () => {
      try {
        setLoading(true);
        
        // Fetch all tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('sprint_tasks')
          .select('id, title')
          .order('order_index');
          
        if (tasksError) throw tasksError;
        
        // Fetch all answers separately
        const { data: progressData, error: progressError } = await supabase
          .from('user_sprint_progress')
          .select('task_id, answers, task_answers')
          .not('answers', 'is', null);
          
        if (progressError) throw progressError;
        
        // Fetch task titles in a separate query
        const { data: taskTitlesData, error: taskTitlesError } = await supabase
          .from('sprint_tasks')
          .select('id, title');
        
        if (taskTitlesError) throw taskTitlesError;
        
        // Create a map of task IDs to titles
        const taskTitleMap = new Map<string, string>();
        if (taskTitlesData) {
          taskTitlesData.forEach(task => {
            taskTitleMap.set(task.id, task.title);
          });
        }
        
        // Process tasks
        if (tasksData) {
          setTasks(tasksData);
          if (tasksData.length > 0 && !selectedTask) {
            setSelectedTask(tasksData[0].id);
          }
        }
        
        // Process answers
        if (progressData) {
          const taskAnswersMap = new Map<string, { taskName: string, answers: Record<string, any>[] }>();
          
          progressData.forEach(item => {
            const taskId = item.task_id;
            const taskName = taskTitleMap.get(taskId) || 'Unknown Task';
            const answerData = item.answers || item.task_answers || {};
            
            if (!taskAnswersMap.has(taskId)) {
              taskAnswersMap.set(taskId, { taskName, answers: [] });
            }
            
            const currentTask = taskAnswersMap.get(taskId);
            if (currentTask && Object.keys(answerData).length > 0) {
              // Ensure answerData is treated as a Record<string, any>
              const typedAnswerData: Record<string, any> = typeof answerData === 'string' 
                ? JSON.parse(answerData) 
                : (answerData as Record<string, any>);
              
              currentTask.answers.push(typedAnswerData);
            }
          });
          
          const processedAnswers: TaskAnswer[] = [];
          taskAnswersMap.forEach((value, key) => {
            processedAnswers.push({
              taskId: key,
              taskName: value.taskName,
              answers: value.answers
            });
          });
          
          setAnswers(processedAnswers);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching answer data:', error);
        setLoading(false);
      }
    };
    
    fetchTasksAndAnswers();
  }, []);

  // Get answers for the selected task
  const selectedTaskAnswers = answers.find(a => a.taskId === selectedTask);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">User Answers Analysis</h3>
        <Select value={selectedTask} onValueChange={setSelectedTask}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {tasks.map(task => (
              <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTaskAnswers ? (
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="raw">Raw Answers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>{selectedTaskAnswers.taskName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  {selectedTaskAnswers.answers.length} responses received
                </div>

                {/* Simple summary analysis */}
                <div className="space-y-4">
                  {selectedTaskAnswers.answers.length > 0 && Object.keys(selectedTaskAnswers.answers[0]).map(key => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{key}</h4>
                      <div className="text-sm">
                        {/* Show common answers */}
                        {Array.from(new Set(selectedTaskAnswers.answers.map(a => 
                          typeof a[key] === 'object' ? JSON.stringify(a[key]) : String(a[key])
                        ))).slice(0, 5).map((uniqueAnswer, index) => (
                          <div key={index} className="py-1 border-b last:border-0">
                            {uniqueAnswer}
                          </div>
                        ))}
                        
                        {Array.from(new Set(selectedTaskAnswers.answers.map(a => 
                          typeof a[key] === 'object' ? JSON.stringify(a[key]) : String(a[key])
                        ))).length > 5 && (
                          <div className="text-xs text-gray-500 mt-2">
                            + {Array.from(new Set(selectedTaskAnswers.answers.map(a => 
                              typeof a[key] === 'object' ? JSON.stringify(a[key]) : String(a[key])
                            ))).length - 5} more unique answers
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="raw">
            <Card>
              <CardHeader>
                <CardTitle>Raw Answers for {selectedTaskAnswers.taskName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {selectedTaskAnswers.answers.map((answer, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Response #{index + 1}</h4>
                        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(answer, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-gray-500">No answers found for this task</div>
      )}
    </div>
  );
};

export default AnswerAnalytics;
