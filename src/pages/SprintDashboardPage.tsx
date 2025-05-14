
import { useEffect, useState } from "react";
import { useSprintTasks } from "@/hooks/useSprintTasks.tsx";
import TaskCard from "@/components/sprint/TaskCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CollaboratorsManagement from "@/components/sprint/CollaboratorsManagement";
import { toast } from "@/components/ui/use-toast";

interface SharedSprint {
  ownerId: string;
  ownerName: string;
  tasks: any[];
}

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTasks();
  const [sharedSprints, setSharedSprints] = useState<SharedSprint[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [collabDialogOpen, setCollabDialogOpen] = useState(false);
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
        console.log("Fetching shared sprints for user:", user.id);
        
        // Get all sprints where the user is a collaborator
        const { data: collaborations, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("sprint_owner_id")
          .eq("collaborator_id", user.id);

        if (collabError) {
          console.error("Error fetching collaborations:", collabError);
          throw collabError;
        }
        
        console.log("Found collaborations:", collaborations);
        
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

          // Fetch tasks for this owner
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

          if (tasksError) {
            console.error("Error fetching tasks:", tasksError);
            throw tasksError;
          }

          console.log(`Owner ${collab.sprint_owner_id} has ${tasks?.length || 0} tasks`);

          const ownerFullName = [
            ownerData?.first_name,
            ownerData?.last_name
          ].filter(Boolean).join(" ") || "Sprint Owner";

          return {
            ownerId: collab.sprint_owner_id,
            ownerName: ownerFullName,
            tasks: tasks || []
          };
        });

        const resolvedSharedSprints = await Promise.all(sharedSprintPromises);
        const sprintsWithTasks = resolvedSharedSprints.filter(sprint => sprint.tasks.length > 0);
        
        console.log("Filtered shared sprints with tasks:", sprintsWithTasks);
        setSharedSprints(sprintsWithTasks);
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
        toast({
          title: "Error loading shared sprints",
          description: "There was a problem loading sprints shared with you",
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
  console.log("Has shared sprints:", hasSharedSprints, sharedSprints);

  return (
    <div>
      <div className={isMobile ? "mb-4" : "mb-8"}>
        <div className="flex justify-between items-center">
          <h1 className={`${isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'} font-bold`}>Your Sprint Journey</h1>
          
          <Dialog open={collabDialogOpen} onOpenChange={setCollabDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "inline"}>Share Sprint</span>
              </Button>
            </DialogTrigger>
            <CollaboratorsManagement isDialog={true} />
          </Dialog>
        </div>
        
        <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>
          Complete all tasks to finish your sprint and develop your full project plan.
        </p>
        
        <Tabs defaultValue="my-sprint" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="my-sprint">My Sprint</TabsTrigger>
            {hasSharedSprints && (
              <TabsTrigger value="shared-sprints" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Shared With Me</span>
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {sharedSprints.length}
                </span>
              </TabsTrigger>
            )}
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
          
          {hasSharedSprints && (
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
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SprintDashboardPage;
