
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

type SprintContext = {
  currentSprintOwnerId: string | null;
  isSharedSprint: boolean;
  sprintOwnerName: string | null;
  switchToOwnSprint: () => void;
  switchToSharedSprint: (ownerId: string, ownerName: string) => void;
};

const SprintContextValue = createContext<SprintContext>({
  currentSprintOwnerId: null,
  isSharedSprint: false,
  sprintOwnerName: null,
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

  // Initialize with user's own sprint
  useEffect(() => {
    if (user?.id) {
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
    }
  }, [user?.id]);

  const switchToOwnSprint = () => {
    if (user?.id) {
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
    }
  };

  const switchToSharedSprint = (ownerId: string, ownerName: string) => {
    setCurrentSprintOwnerId(ownerId);
    setIsSharedSprint(true);
    setSprintOwnerName(ownerName);
  };

  return (
    <SprintContextValue.Provider
      value={{
        currentSprintOwnerId,
        isSharedSprint,
        sprintOwnerName,
        switchToOwnSprint,
        switchToSharedSprint,
      }}
    >
      {children}
    </SprintContextValue.Provider>
  );
};
