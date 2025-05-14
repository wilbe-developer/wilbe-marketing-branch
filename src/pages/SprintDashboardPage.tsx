
import { useEffect, useState } from "react";
import { useSprintTasks } from "@/hooks/useSprintTasks.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { CollaborateButton } from "@/components/sprint/CollaborateButton";
import { toast } from "@/hooks/use-toast";
import { ProgressDisplay } from "@/components/sprint/ProgressDisplay";
import { SharedSprintsList } from "@/components/sprint/SharedSprintsList";
import { MySprintsList } from "@/components/sprint/MySprintsList";
import { useSharedSprints } from "@/hooks/useSharedSprints";

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTasks();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { sharedSprints, isLoading: loadingShared } = useSharedSprints(user?.id);

  // Calculate overall completion percentage
  const completedTasks = tasksWithProgress.filter(task => task.progress?.completed).length;
  const totalTasks = tasksWithProgress.length;

  const hasSharedSprints = sharedSprints.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
          <ProgressDisplay completedTasks={completedTasks} totalTasks={totalTasks} />
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
              <ProgressDisplay completedTasks={completedTasks} totalTasks={totalTasks} />
              <MySprintsList tasks={tasksWithProgress} />
            </TabsContent>
            
            <TabsContent value="shared-sprints">
              <SharedSprintsList 
                sharedSprints={sharedSprints} 
                isLoading={loadingShared} 
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {!hasSharedSprints && (
        <MySprintsList tasks={tasksWithProgress} />
      )}
    </div>
  );
};

export default SprintDashboardPage;
