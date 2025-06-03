
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
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTaskDefinitions();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isSharedSprint, sprintOwnerName, currentSprintUserId } = useSprintContext();

  // Calculate overall completion percentage
  const completedTasks = tasksWithProgress.filter(task => task.progress?.completed).length;
  const totalTasks = tasksWithProgress.length;

  // Get the appropriate user ID for the data room (current sprint user or logged-in user)
  const dataRoomUserId = currentSprintUserId || user?.id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pageTitle = isSharedSprint ? `${sprintOwnerName}'s BSF` : "Your BSF Journey";

  return (
    <div>
      <div className={isMobile ? "mb-4" : "mb-8"}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>{pageTitle}</h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Complete all tasks to finish your BSF and develop your full project plan.
            </p>
          </div>
          
          {/* Data Room Button - prominently placed */}
          {!isMobile && dataRoomUserId && (
            <div className="ml-4">
              <Button asChild variant="outline" size="lg">
                <Link to={`/sprint/data-room/${dataRoomUserId}`}>
                  <FileText className="mr-2 h-5 w-5" />
                  View Data Room
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Data Room Button */}
        {isMobile && dataRoomUserId && (
          <div className="mb-4">
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to={`/sprint/data-room/${dataRoomUserId}`}>
                <FileText className="mr-2 h-5 w-5" />
                View Data Room
              </Link>
            </Button>
          </div>
        )}
        
        {/* Action buttons - only show for non-shared sprints */}
        {!isSharedSprint && user?.id && (
          <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
            <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2`}>
              <ImStuckButton />
              <RequestCallButton />
              <AssessmentButton />
              <CollaborateButton />
            </div>
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
