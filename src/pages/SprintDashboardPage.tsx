
import { useEffect } from "react";
import { useSprintTaskDefinitions } from "@/hooks/useSprintTaskDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { CollaborateButton } from "@/components/sprint/CollaborateButton";
import { ProgressDisplay } from "@/components/sprint/ProgressDisplay";
import { MySprintsList } from "@/components/sprint/MySprintsList";
import { SharedSprintsSelector } from "@/components/sprint/SharedSprintsSelector";
import { SharedSprintBanner } from "@/components/sprint/SharedSprintBanner";
import { useSprintContext } from "@/hooks/useSprintContext";

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTaskDefinitions();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isSharedSprint, sprintOwnerName } = useSprintContext();

  // Calculate overall completion percentage
  const completedTasks = tasksWithProgress.filter(task => task.progress?.completed).length;
  const totalTasks = tasksWithProgress.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pageTitle = isSharedSprint ? `${sprintOwnerName}'s Sprint` : "Your Sprint Journey";

  return (
    <div>
      <div className={isMobile ? "mb-4" : "mb-8"}>
        <div className="flex justify-between items-center mb-2">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{pageTitle}</h1>
          {!isSharedSprint && user?.id && <CollaborateButton />}
        </div>
        
        <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>
          Complete all tasks to finish your sprint and develop your full project plan.
        </p>
        
        <SharedSprintBanner />
        
        {/* Displays the selector for shared sprints if they exist */}
        <SharedSprintsSelector />
        
        <ProgressDisplay completedTasks={completedTasks} totalTasks={totalTasks} />
      </div>

      <MySprintsList tasks={tasksWithProgress} />
    </div>
  );
};

export default SprintDashboardPage;
