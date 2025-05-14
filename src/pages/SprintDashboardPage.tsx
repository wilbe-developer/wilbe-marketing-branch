
import { useEffect, useState } from "react";
import { useSprintTasks } from "@/hooks/useSprintTasks.tsx";
import TaskCard from "@/components/sprint/TaskCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { CollaborateButton } from "@/components/sprint/CollaborateButton";
import { UserTaskProgress } from "@/types/sprint";
import { toast } from "@/components/ui/use-toast";

// Define simple interfaces to avoid circular type references
interface TaskProgress {
  id: string;
  completed: boolean;
  completed_at: string | null;
  file_id: string | null;
  task_answers: any;
}

// The raw task progress as returned by Supabase (as an array)
interface RawTaskProgress {
  id: string;
  completed: boolean;
  completed_at: string | null;
  file_id: string | null;
  task_answers: any;
}

// Basic Task interface without nested progress object
interface BasicTask {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  order_index: number;
  content: string | null;
  question: string | null;
  options: any | null;
  upload_required: boolean;
  status: string | null;
}

// Shared Task interface with optional progress property
interface SharedTask extends BasicTask {
  progress?: TaskProgress;
}

// Used for the state to avoid deep nesting
interface SharedSprint {
  ownerId: string;
  ownerName: string;
  tasks: SharedTask[];
}

// Raw task interface as returned from Supabase
interface RawTask extends BasicTask {
  progress: RawTaskProgress[] | null;
}

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTasks();
  const [sharedSprints, setSharedSprints] = useState<SharedSprint[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Calculate overall completion percentage
  const completedTasks = tasksWithProgress.filter(task => task.progress?.completed).length;
  const totalTasks = tasksWithProgress.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Fetch shared sprints
  useEffect(() => {
    const fetchSharedSprints = async () => {
      if (!user?.id) return;
      
      setLoadingShared(true);
      try {
        // Get all sprints where the user is a collaborator
        const { data: collaborations, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("sprint_owner_id")
          .eq("collaborator_id", user.id);

        if (collabError) throw collabError;
        
        if (!collaborations || collaborations.length === 0) {
          setSharedSprints([]);
          setLoadingShared(false);
          return;
        }

        const sharedSprintPromises = collaborations.map(async (collab) => {
          // Fetch owner profile data separately
          const { data: ownerData, error: ownerError } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", collab.sprint_owner_id)
            .single();
            
          if (ownerError && ownerError.code !== 'PGRST116') {
            console.error("Error fetching owner profile:", ownerError);
          }

          // Fetch tasks with progress data
          const { data: rawTasks, error: tasksError } = await supabase
            .from("sprint_tasks")
            .select("*, progress:user_sprint_progress(id, completed, completed_at, file_id, task_answers)")
            .eq("user_id", collab.sprint_owner_id)
            .order("order_index");

          if (tasksError) throw tasksError;

          // Transform data to match our interfaces
          const transformedTasks: SharedTask[] = (rawTasks || []).map((rawTask: RawTask) => {
            // Extract the progress data, if it exists
            const progressArray = rawTask.progress;
            const firstProgress = progressArray && progressArray.length > 0 ? progressArray[0] : undefined;
            
            // Create a SharedTask with properly transformed progress
            const sharedTask: SharedTask = {
              id: rawTask.id,
              title: rawTask.title,
              description: rawTask.description,
              category: rawTask.category,
              order_index: rawTask.order_index,
              content: rawTask.content,
              question: rawTask.question,
              options: rawTask.options,
              upload_required: rawTask.upload_required,
              status: rawTask.status
            };
            
            // Add progress if it exists
            if (firstProgress) {
              sharedTask.progress = {
                id: firstProgress.id,
                completed: firstProgress.completed,
                completed_at: firstProgress.completed_at,
                file_id: firstProgress.file_id,
                task_answers: firstProgress.task_answers
              };
            }
            
            return sharedTask;
          });

          const ownerFullName = [
            ownerData?.first_name,
            ownerData?.last_name
          ].filter(Boolean).join(" ") || "Sprint Owner";

          // Return a properly typed SharedSprint object
          return {
            ownerId: collab.sprint_owner_id,
            ownerName: ownerFullName,
            tasks: transformedTasks
          };
        });

        const resolvedSharedSprints = await Promise.all(sharedSprintPromises);
        setSharedSprints(resolvedSharedSprints.filter(sprint => sprint.tasks.length > 0));
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
        toast({
          title: "Error",
          description: "Could not load shared sprints. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoadingShared(false);
      }
    };

    fetchSharedSprints();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasSharedSprints = sharedSprints.length > 0;

  return (
    <div>
      <div className={isMobile ? "mb-4" : "mb-8"}>
        <div className="flex justify-between items-center mb-2">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Your Sprint Journey</h1>
          {user?.id && <CollaborateButton />}
        </div>
        <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>
          Complete all tasks to finish your sprint and develop your full project plan.
        </p>
        
        {!hasSharedSprints ? (
          <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
            <div className="flex justify-between items-center mb-2">
              <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>Overall Progress</h2>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-brand-pink h-3 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {completionPercentage}% complete
            </p>
          </div>
        ) : (
          <Tabs defaultValue="my-sprint" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="my-sprint">My Sprint</TabsTrigger>
              <TabsTrigger value="shared-sprints" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Shared With Me</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-sprint">
              <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>Overall Progress</h2>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-brand-pink h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {completionPercentage}% complete
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                {tasksWithProgress.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    disabled={false}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shared-sprints">
              {loadingShared ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {sharedSprints.map((sprint) => (
                    <div key={sprint.ownerId} className="space-y-4">
                      <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-blue-600" />
                        <h2 className="text-xl font-medium text-blue-800">
                          {sprint.ownerName}'s Sprint
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {sprint.tasks.map((task) => {
                          // Create a compatible task object for TaskCard
                          const compatibleTask = {
                            ...task,
                            // Ensure these fields exist to satisfy TaskCard's requirements
                            question: task.question || null,
                            options: task.options || null,
                            progress: task.progress
                          } as UserTaskProgress;
                          
                          return (
                            <TaskCard 
                              key={task.id} 
                              task={compatibleTask}
                              disabled={false}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {!hasSharedSprints && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {tasksWithProgress.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              disabled={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintDashboardPage;
