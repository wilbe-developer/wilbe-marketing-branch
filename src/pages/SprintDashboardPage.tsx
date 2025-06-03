
import { useEffect } from "react";
import { useSprintTaskDefinitions } from "@/hooks/useSprintTaskDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { CollaborateButton } from "@/components/sprint/CollaborateButton";
import { AssessmentButton } from "@/components/sprint/AssessmentButton";
import { RequestCallButton } from "@/components/sprint/RequestCallButton";
import { ImStuckButton } from "@/components/sprint/ImStuckButton";
import { ProgressDisplay } from "@/components/sprint/ProgressDisplay";
import { SprintCountdown } from "@/components/sprint/SprintCountdown";
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
          
          {/* Desktop view buttons */}
          {!isMobile && !isSharedSprint && user?.id && (
            <div className="flex gap-2">
              <ImStuckButton />
              <RequestCallButton />
              <AssessmentButton />
              <CollaborateButton />
            </div>
          )}
        </div>
        
        <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>
          Complete all tasks to finish your sprint and develop your full project plan.
        </p>
        
        {/* Mobile view buttons - improved to ensure they fit well on mobile */}
        {isMobile && !isSharedSprint && user?.id && (
          <div className="flex flex-wrap gap-2 mb-4 w-full">
            <ImStuckButton />
            <RequestCallButton />
            <AssessmentButton />
            <CollaborateButton />
          </div>
        )}
        
        <SharedSprintBanner />
        
        {/* Displays the selector for shared sprints if they exist */}
        <SharedSprintsSelector />
        
        {/* Sprint Countdown Timer */}
        <div className="mb-6">
          <SprintCountdown />
        </div>
        
        <ProgressDisplay completedTasks={completedTasks} totalTasks={totalTasks} />
      </div>

      <MySprintsList tasks={tasksWithProgress} />
    </div>
  );
};

export default SprintDashboardPage;
