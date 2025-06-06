
import React, { createContext, useContext } from 'react';
import { useTutorial } from '@/hooks/useTutorial';

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: any[];
  hasCompleted: boolean;
  positions: Record<string, DOMRect>;
  isLoading: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  restartTutorial: () => void;
  currentStepData: any;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const tutorial = useTutorial();

  return (
    <TutorialContext.Provider value={tutorial}>
      {children}
    </TutorialContext.Provider>
  );
};
