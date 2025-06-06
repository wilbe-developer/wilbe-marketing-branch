
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { useTutorialContext } from './TutorialProvider';
import { useIsMobile } from '@/hooks/use-mobile';

export const TutorialTooltip: React.FC = () => {
  const {
    isActive,
    currentStepData,
    positions,
    nextStep,
    prevStep,
    skipTutorial,
    isFirstStep,
    isLastStep,
    progress,
    currentStep,
    steps
  } = useTutorialContext();
  
  const isMobile = useIsMobile();

  if (!isActive || !currentStepData) return null;

  // For the welcome step, center the tooltip
  const isWelcomeStep = currentStepData.id === 'welcome';
  
  if (isWelcomeStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
        <Card
          className="shadow-lg border-2 border-brand-pink/30 bg-white max-w-md w-full"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-brand-pink pr-2">
                {currentStepData.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTutorial}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {currentStepData.content}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="text-xs"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTutorial}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Skip
                </Button>
                
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="text-xs bg-brand-pink hover:bg-brand-pink/90 text-white"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For all other steps, use the existing positioning logic
  const targetPosition = positions[currentStepData.targetElement];
  
  if (!targetPosition) return null;

  // Calculate tooltip position based on target element and preferred position
  const getTooltipPosition = () => {
    const padding = 16;
    const tooltipWidth = isMobile ? 280 : 320;
    const tooltipHeight = 200; // Approximate height
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = 0;
    let left = 0;
    
    switch (currentStepData.position) {
      case 'top':
        top = targetPosition.top - tooltipHeight - padding;
        left = targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = targetPosition.bottom + padding;
        left = targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2);
        left = targetPosition.left - tooltipWidth - padding;
        break;
      case 'right':
        top = targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2);
        left = targetPosition.right + padding;
        break;
    }
    
    // Enhanced viewport bounds checking with better fallback positioning
    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }
    
    // More intelligent vertical positioning
    if (top < padding) {
      // If tooltip would be above viewport, position it below the target
      top = targetPosition.bottom + padding;
    }
    if (top + tooltipHeight > viewportHeight - padding) {
      // If tooltip would be below viewport, position it above the target
      top = Math.max(padding, targetPosition.top - tooltipHeight - padding);
    }
    
    return { top, left };
  };

  const { top, left } = getTooltipPosition();

  return (
    <Card
      className="fixed z-50 shadow-lg border-2 border-brand-pink/30 bg-white pointer-events-auto"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: isMobile ? '280px' : '320px',
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-brand-pink pr-2">
            {currentStepData.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTutorial}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {currentStepData.content}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTutorial}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <SkipForward className="h-3 w-3 mr-1" />
              Skip
            </Button>
            
            <Button
              size="sm"
              onClick={nextStep}
              className="text-xs bg-brand-pink hover:bg-brand-pink/90 text-white"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
