import { useAuth } from "@/hooks/useAuth";
import { useSprintContext } from "@/hooks/useSprintContext";

export const useGuestUser = () => {
  const { hasSprintProfile, hasCollaboratorAccess, isAuthenticated } = useAuth();
  const { isSharedSprint } = useSprintContext();
  
  // A guest user is someone who:
  // 1. Is authenticated
  // 2. Has collaborator access to sprints
  // 3. Doesn't have their own sprint profile
  const isGuestUser = isAuthenticated && hasCollaboratorAccess && !hasSprintProfile;
  
  // For guest users, we want them to default to shared sprints when they access /sprint/dashboard
  // This replaces the old shouldShowSharedByDefault logic
  const shouldAutoSwitchToShared = isGuestUser && !isSharedSprint;
  
  return {
    isGuestUser,
    shouldAutoSwitchToShared,
    // Keep the old property for backward compatibility, but it now just mirrors shouldAutoSwitchToShared
    shouldShowSharedByDefault: shouldAutoSwitchToShared
  };
};
