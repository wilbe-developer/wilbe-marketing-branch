
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isNextDisabled: boolean;
  isLastStep: boolean;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps,
  handlePrevious,
  handleNext,
  isNextDisabled,
  isLastStep
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
      
      <Button
        onClick={handleNext}
        disabled={isNextDisabled}
      >
        {isLastStep ? 'Complete' : 'Next'}
      </Button>
    </div>
  );
};

export default StepNavigator;
