
import { useEffect, useState } from "react";
import { useSprintTasks } from "@/hooks/useSprintTasks.tsx";
import TaskCard from "@/components/sprint/TaskCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";

interface SharedSprint {
  ownerId: string;
  ownerName: string;
  tasks: any[];
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
          .select(`
            sprint_owner_id,
            owner:sprint_owner_id(
              id,
              first_name,
              last_name
            )
          `)
          .eq("collaborator_id", user.id);

        if (collabError) throw collabError;

        const sharedSprintPromises = collaborations.map(async (collab) => {
          const { data: tasks, error: tasksError } = await supabase
            .from("sprint_tasks")
            .select(`
              *,
              progress:user_sprint_progress(
                id,
                completed,
                completed_at,
                file_id,
                task_answers
              )
            `)
            .eq("user_id", collab.sprint_owner_id)
            .order("order_index");

          if (tasksError) throw tasksError;

          const ownerFullName = [
            collab.owner?.first_name,
            collab.owner?.last_name
          ].filter(Boolean).join(" ") || "Sprint Owner";

          return {
            ownerId: collab.sprint_owner_id,
            ownerName: ownerFullName,
            tasks: tasks || []
          };
        });

        const resolvedSharedSprints = await Promise.all(sharedSprintPromises);
        setSharedSprints(resolvedSharedSprints.filter(sprint => sprint.tasks.length > 0));
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
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
        <h1 className={`${isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'} font-bold`}>Your Sprint Journey</h1>
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
                        {sprint.tasks.map((task) => (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            disabled={false}
                          />
                        ))}
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
