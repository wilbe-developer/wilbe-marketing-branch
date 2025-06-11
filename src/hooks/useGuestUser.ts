
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
  
  // Guest users should see shared sprints by default
  const shouldShowSharedByDefault = isGuestUser && !isSharedSprint;
  
  return {
    isGuestUser,
    shouldShowSharedByDefault
  };
};
