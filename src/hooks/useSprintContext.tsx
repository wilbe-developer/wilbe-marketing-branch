
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";

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

  // Initialize with user's own sprint when user is available
  useEffect(() => {
    if (user?.id && !currentSprintOwnerId) {
      console.log("SprintContext - Initializing with user's own sprint:", user.id);
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
    }
  }, [user?.id, currentSprintOwnerId]);

  const switchToOwnSprint = () => {
    if (user?.id) {
      console.log("SprintContext - Switching to own sprint:", user.id);
      setCurrentSprintOwnerId(user.id);
      setIsSharedSprint(false);
      setSprintOwnerName(null);
    }
  };

  const switchToSharedSprint = (ownerId: string, ownerName: string) => {
    console.log("SprintContext - Switching to shared sprint:", { ownerId, ownerName });
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
