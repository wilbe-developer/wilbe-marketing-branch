import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSprintTaskDefinitions } from '@/hooks/useSprintTaskDefinitions';
import { SprintTaskLogicRouter } from "@/components/sprint/sprint-task-logic";
import QuestionForm from '@/components/sprint/QuestionForm';
import FileUploader from '@/components/sprint/FileUploader';
import UploadedFileView from '@/components/sprint/UploadedFileView';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ImStuckButton } from '@/components/sprint/ImStuckButton';
import { SharedSprintBanner } from '@/components/sprint/SharedSprintBanner';
import { WorkloadBadge } from '@/components/sprint/WorkloadBadge';
import { supabase } from '@/integrations/supabase/client';
import { SprintTaskDefinition } from '@/types/task-builder';
import { generateTaskSummary, extractTaskWorkload } from '@/utils/taskDefinitionAdapter';

const SprintTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasksWithProgress, updateProgress, isLoading } = useSprintTaskDefinitions();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [taskDefinition, setTaskDefinition] = useState<SprintTaskDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);

  // Find the current task
  const currentTask = tasksWithProgress.find(task => task.id === taskId);

  // Fetch the full task definition if needed
  useEffect(() => {
    const fetchTaskDefinition = async () => {
      if (!taskId) return;
      
      setIsLoadingDefinition(true);
      
      try {
        const { data, error } = await supabase
          .from('sprint_task_definitions')
          .select('*')
          .eq('id', taskId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching task definition:', error);
        } else if (data) {
          // Process the definition before setting it
          let parsedDefinition;
          if (typeof data.definition === 'string') {
            try {
              parsedDefinition = JSON.parse(data.definition);
            } catch (e) {
              console.error("Failed to parse definition JSON:", e);
              parsedDefinition = {};
            }
          } else {
            parsedDefinition = data.definition || {};
          }
          
          setTaskDefinition({
            ...data,
            definition: parsedDefinition
          } as SprintTaskDefinition);
        }
      } catch (err) {
        console.error('Failed to fetch task definition:', err);
      } finally {
        setIsLoadingDefinition(false);
      }
    };
    
    fetchTaskDefinition();
  }, [taskId]);

  if (isLoading || isLoadingDefinition) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentTask) {
    return <div className="text-center p-8">Task not found</div>;
  }

  const isCompleted = currentTask.progress?.completed || false;
  const hasUploadedFile = !!currentTask.progress?.file_id;
  
  // Generate a display summary if we have the task definition
  const taskSummary = taskDefinition ? generateTaskSummary(taskDefinition) : currentTask;

  // Get workload info from current task or calculate it
  const workload = currentTask.workload || (taskDefinition ? extractTaskWorkload(taskDefinition) : null);

  const handleTaskCompletion = async (fileId?: string) => {
    await updateProgress.mutateAsync({
      taskId: currentTask.id,
      completed: true,
      fileId
    });
  };

  const handleAnswerSubmission = async (answers: Record<string, any>) => {
    await updateProgress.mutateAsync({
      taskId: currentTask.id,
      completed: true,
      answers
    });
  };

  // Try loading a logic component for this task
  const LogicComponent = (
    <SprintTaskLogicRouter
      task={currentTask}
      isCompleted={isCompleted}
      onComplete={handleTaskCompletion}
      taskDefinition={taskDefinition?.definition}
    />
  );

  return (
    <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}>
      <SharedSprintBanner />
      
      <div className={`${isMobile ? 'flex flex-col' : 'flex justify-between items-start'}`}>
        <div className="flex-1">
          <h1 className={`${isMobile ? 'text-2xl mb-2' : 'text-3xl mb-2'} font-bold`}>
            {taskSummary.title}
          </h1>
          
          {/* Workload badge under title */}
          {workload && (
            <div className="mb-3">
              <WorkloadBadge workload={workload} showTime={true} size={isMobile ? 'sm' : 'default'} />
            </div>
          )}
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'mb-2 mt-2' : 'ml-4'}`}>
          <ImStuckButton taskId={currentTask.id} />
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={() => navigate(`/community?challenge=${currentTask.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Discuss
          </Button>
        </div>
      </div>
      
      <p className={`text-gray-600 ${isMobile ? 'mb-4 text-sm' : 'mb-8'}`}>
        {taskSummary.description}
      </p>

      {taskSummary.content && (
        <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-3 mb-4' : 'p-6 mb-8'}`}>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: taskSummary.content }} />
        </div>
      )}

      <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-3 mb-4' : 'p-6 mb-8'}`}>
        {LogicComponent || (
          <>
            {currentTask.upload_required ? (
              hasUploadedFile ? (
                <UploadedFileView
                  fileId={currentTask.progress?.file_id || ''}
                  isCompleted={isCompleted}
                />
              ) : (
                <FileUploader
                  onFileUploaded={(fileId) => handleTaskCompletion(fileId)}
                  onUploadComplete={handleTaskCompletion}
                  isCompleted={isCompleted}
                />
              )
            ) : (
              currentTask.question && (
                <QuestionForm
                  task={currentTask}
                  onSubmit={handleAnswerSubmission}
                  isCompleted={isCompleted}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SprintTaskPage;
