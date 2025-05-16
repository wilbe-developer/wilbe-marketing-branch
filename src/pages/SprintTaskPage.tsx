
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
import { SharedSprintBanner } from '@/components/sprint/SharedSprintBanner';
import { supabase } from '@/integrations/supabase/client';
import { SprintTaskDefinition } from '@/types/task-builder';

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
          setTaskDefinition(data);
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
    />
  );

  return (
    <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}>
      <SharedSprintBanner />
      
      <div className="flex justify-between items-center">
        <h1 className={`${isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'} font-bold`}>{currentTask.title}</h1>
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={() => navigate(`/community/new?challenge=${currentTask.id}`)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Discuss
        </Button>
      </div>
      
      <p className={`text-gray-600 ${isMobile ? 'mb-4 text-sm' : 'mb-8'}`}>{currentTask.description}</p>

      {currentTask.content && (
        <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-3 mb-4' : 'p-6 mb-8'}`}>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentTask.content }} />
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
