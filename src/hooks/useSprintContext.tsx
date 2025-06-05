
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

type AccessLevel = 'view' | 'edit' | 'manage';

type SprintContext = {
  currentSprintOwnerId: string | null;
  isSharedSprint: boolean;
  sprintOwnerName: string | null;
  userAccessLevel: AccessLevel | null;
  canManage: boolean;
  switchToOwnSprint: () => void;
  switchToSharedSprint: (ownerId: string, ownerName: string) => void;
};

const SprintContextValue = createContext<SprintContext>({
  currentSprintOwnerId: null,
  isSharedSprint: false,
  sprintOwnerName: null,
  userAccessLevel: null,
  canManage: false,
  switchToOwnSprint: () => {},
  switchToSharedSprint: () => {},
});

export const useSprintContext = () => useContext(SprintContextValue);

interface SprintContextProviderProps {
  children: ReactNode;
}

export const SprintContextProvider = ({ children }: SprintContextProviderProps) => {
  const { user } = useAuth();
  const [currentSprintOwnerId, setCurrentSprintOwnerId] = useState<string | null>(null);
  const [isSharedSprint, setIsSharedSprint] = useState(false);
  const [sprintOwnerName, setSprintOwnerName] = useState<string | null>(null);
  const [userAccessLevel, setUserAccessLevel] = useState<AccessLevel | null>(null);

  // Derived state for convenience
  const canManage = userAccessLevel === 'manage' || !isSharedSprint;

  // Initialize with user's own sprint
  useEffect(() => {
    if (user?.id) {
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
      setUserAccessLevel(null);
    }
  }, [user?.id]);

  // Fetch user's access level when viewing a shared sprint
  useEffect(() => {
    const fetchAccessLevel = async () => {
      if (!user?.id || !isSharedSprint || !currentSprintOwnerId) {
        setUserAccessLevel(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sprint_collaborators")
          .select("access_level")
          .eq("sprint_owner_id", currentSprintOwnerId)
          .eq("collaborator_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching access level:", error);
          setUserAccessLevel('view'); // Default to view if error
          return;
        }

        setUserAccessLevel(data.access_level as AccessLevel);
      } catch (error) {
        console.error("Error fetching access level:", error);
        setUserAccessLevel('view');
      }
    };

    fetchAccessLevel();
  }, [user?.id, isSharedSprint, currentSprintOwnerId]);

  const switchToOwnSprint = () => {
    if (user?.id) {
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
      setUserAccessLevel(null);
    }
  };

  const switchToSharedSprint = (ownerId: string, ownerName: string) => {
    setCurrentSprintOwnerId(ownerId);
    setIsSharedSprint(true);
    setSprintOwnerName(ownerName);
    // Access level will be fetched by the useEffect
  };

  return (
    <SprintContextValue.Provider
      value={{
        currentSprintOwnerId,
        isSharedSprint,
        sprintOwnerName,
        userAccessLevel,
        canManage,
        switchToOwnSprint,
        switchToSharedSprint,
      }}
    >
      {children}
    </SprintContextValue.Provider>
  );
};
