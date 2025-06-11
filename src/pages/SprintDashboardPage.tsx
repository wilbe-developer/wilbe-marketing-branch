
import { useEffect } from "react";
import { useSprintTaskDefinitions } from "@/hooks/useSprintTaskDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useGuestUser } from "@/hooks/useGuestUser";
import { useSharedSprints } from "@/hooks/useSharedSprints";
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
import { Eye, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const SprintDashboardPage = () => {
  const { tasksWithProgress, isLoading } = useSprintTaskDefinitions();
  const isMobile = useIsMobile();
  const { user, hasSprintProfile } = useAuth();
  const { isSharedSprint, sprintOwnerName, currentSprintOwnerId, canManage, switchToSharedSprint } = useSprintContext();
  const { isGuestUser } = useGuestUser();
  const { sharedSprints } = useSharedSprints(user?.id);

  // Auto-switch guest users to shared sprint view when they land on /sprint/dashboard
  useEffect(() => {
    if (isGuestUser && !isSharedSprint && sharedSprints.length > 0) {
      // Switch to the first available shared sprint
      const firstSharedSprint = sharedSprints[0];
      switchToSharedSprint(firstSharedSprint.owner_id, firstSharedSprint.owner_name);
    }
  }, [isGuestUser, isSharedSprint, sharedSprints, switchToSharedSprint]);

  // Calculate overall completion percentage
  const completedTasks = tasksWithProgress.filter(task => task.progress?.completed).length;
  const totalTasks = tasksWithProgress.length;

  // Get the appropriate user ID for the data room (current sprint user or logged-in user)
  const dataRoomUserId = currentSprintOwnerId || user?.id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pageTitle = isSharedSprint ? `${sprintOwnerName}'s BSF` : "Your BSF Journey";

  return (
    <div data-tutorial-id="dashboard-container">
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
            <div className="ml-4" data-tutorial-id="data-room-button">
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
          <div className="mb-4" data-tutorial-id="data-room-button">
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to={`/sprint/data-room/${dataRoomUserId}`}>
                <FileText className="mr-2 h-5 w-5" />
                View Data Room
              </Link>
            </Button>
          </div>
        )}

        {/* Guest User CTA - For guest users, link to sprint signup instead of switching context */}
        {isGuestUser && !hasSprintProfile && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Start Your Own BSF?</h3>
            <p className="text-blue-700 mb-3">
              You're currently viewing a shared BSF. Create your own BSF to track your startup journey and access all features.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/sprint-signup">
                <Plus className="mr-2 h-4 w-4" />
                Start Your BSF
              </Link>
            </Button>
          </div>
        )}
        
        {/* Action buttons - show for non-shared sprints OR for users with manage access */}
        {(!isSharedSprint || canManage) && user?.id && (
          <div className={`${isMobile ? 'mb-4' : 'mb-6'}`} data-tutorial-id="quick-actions">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
            <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2`}>
              <ImStuckButton />
              <RequestCallButton />
              <div data-tutorial-id="assessment-button">
                <AssessmentButton />
              </div>
              <div data-tutorial-id="collaborate-button">
                <CollaborateButton />
              </div>
            </div>
          </div>
        )}
        
        <SharedSprintBanner />
        
        {/* Displays the selector for shared sprints if they exist */}
        <SharedSprintsSelector />
        
        {/* Sprint Countdown Timer - show for non-shared sprints OR for users with manage access */}
        {(!isSharedSprint || canManage) && (
          <div className="mb-6" data-tutorial-id="sprint-countdown">
            <SprintCountdown />
          </div>
        )}
        
        <div data-tutorial-id="progress-display">
          <ProgressDisplay completedTasks={completedTasks} totalTasks={totalTasks} />
        </div>
      </div>

      <div data-tutorial-id="task-list">
        <MySprintsList tasks={tasksWithProgress} />
      </div>
    </div>
  );
};

export default SprintDashboardPage;
