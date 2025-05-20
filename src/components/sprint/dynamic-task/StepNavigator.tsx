
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isNextDisabled: boolean;
  isLastStep: boolean;
  handleComplete?: () => void;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps,
  handlePrevious,
  handleNext,
  isNextDisabled,
  isLastStep,
  handleComplete
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
      >
        Previous
      </Button>
      
      {isLastStep && handleComplete ? (
        <Button onClick={handleComplete}>
          Complete Task
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          {isLastStep ? 'Complete' : 'Next'}
        </Button>
      )}
    </div>
  );
};

export default StepNavigator;
