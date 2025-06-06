
import { useState, useEffect, useCallback, useRef } from 'react';
import { TutorialStep, TutorialState, TutorialContext } from '@/types/tutorial';
import { getMobileSteps, getDesktopSteps } from '@/config/tutorialSteps';
import { useAuth } from '@/hooks/useAuth';
import { useSprintContext } from '@/hooks/useSprintContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTutorial = () => {
  const { user } = useAuth();
  const { isSharedSprint, canManage, currentSprintOwnerId } = useSprintContext();
  const isMobile = useIsMobile();
  
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    steps: [],
    hasCompleted: false,
    positions: {},
    isLoading: true
  });

  const observerRef = useRef<MutationObserver | null>(null);

  // Custom smooth scroll function with easing - now pure with no side effects
  const smoothScrollTo = useCallback((targetY: number, duration: number = 1200) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easedProgress = easeInOutCubic(progress);
      const currentY = startY + (distance * easedProgress);
      
      window.scrollTo(0, currentY);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Get tutorial context for step filtering
  const getTutorialContext = useCallback((): TutorialContext => ({
    isSharedSprint,
    canManage,
    isMobile,
    dataRoomUserId: currentSprintOwnerId || user?.id,
    completedTasks: 0, // This will be passed from dashboard
    totalTasks: 0
  }), [isSharedSprint, canManage, isMobile, currentSprintOwnerId, user?.id]);

  // Filter steps based on conditions
  const getFilteredSteps = useCallback((): TutorialStep[] => {
    const baseSteps = isMobile ? getMobileSteps() : getDesktopSteps();
    const context = getTutorialContext();
    
    return baseSteps.filter(step => {
      if (step.condition) {
        return step.condition(context);
      }
      return true;
    });
  }, [isMobile, getTutorialContext]);

  // Load tutorial state from database
  const loadTutorialState = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('sprint_profiles')
        .select('tutorial_completed, tutorial_last_step')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading tutorial state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const steps = getFilteredSteps();
      
      setState(prev => ({
        ...prev,
        steps,
        hasCompleted: data?.tutorial_completed || false,
        currentStep: data?.tutorial_last_step || 0,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading tutorial state:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user?.id, getFilteredSteps]);

  // Save tutorial progress to database
  const saveTutorialProgress = useCallback(async (stepIndex: number, completed: boolean = false) => {
    if (!user?.id) return;

    try {
      const updates: any = {
        tutorial_last_step: stepIndex
      };

      if (completed) {
        updates.tutorial_completed = true;
        updates.tutorial_dismissed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('sprint_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving tutorial progress:', error);
      }
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
    }
  }, [user?.id]);

  // Calculate element positions only - no auto-scrolling here
  const calculatePositions = useCallback(() => {
    const newPositions: Record<string, DOMRect> = {};
    
    state.steps.forEach(step => {
      const element = document.querySelector(`[data-tutorial-id="${step.targetElement}"]`);
      if (element) {
        newPositions[step.targetElement] = element.getBoundingClientRect();
      }
    });

    setState(prev => ({ ...prev, positions: newPositions }));
  }, [state.steps]);

  // Separate function for auto-scrolling to current step
  const autoScrollToCurrentStep = useCallback(() => {
    if (!state.isActive || !state.steps[state.currentStep]) return;

    const currentStep = state.steps[state.currentStep];
    const targetElement = document.querySelector(`[data-tutorial-id="${currentStep.targetElement}"]`);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      
      // Calculate scroll position to center the element in the upper third of the viewport
      // This leaves room for the tooltip below
      const targetScrollY = elementTop - (viewportHeight * 0.3) + (elementHeight / 2);
      
      // Use custom smooth scroll
      smoothScrollTo(Math.max(0, targetScrollY));
    }
  }, [state.isActive, state.currentStep, state.steps, smoothScrollTo]);

  // Start tutorial
  const startTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }));
  }, []);

  // Next step
  const nextStep = useCallback(() => {
    setState(prev => {
      const newStep = prev.currentStep + 1;
      
      if (newStep >= prev.steps.length) {
        // Tutorial completed
        saveTutorialProgress(newStep, true);
        toast({
          title: "Tutorial completed! 🎉",
          description: "You're all set to start your BSF journey!"
        });
        return {
          ...prev,
          isActive: false,
          hasCompleted: true,
          currentStep: newStep
        };
      }

      saveTutorialProgress(newStep);
      return { ...prev, currentStep: newStep };
    });
  }, [saveTutorialProgress]);

  // Previous step
  const prevStep = useCallback(() => {
    setState(prev => {
      const newStep = Math.max(0, prev.currentStep - 1);
      saveTutorialProgress(newStep);
      return { ...prev, currentStep: newStep };
    });
  }, [saveTutorialProgress]);

  // Skip tutorial
  const skipTutorial = useCallback(() => {
    saveTutorialProgress(state.steps.length, true);
    setState(prev => ({
      ...prev,
      isActive: false,
      hasCompleted: true
    }));
    toast({
      title: "Tutorial skipped",
      description: "You can restart it anytime from your profile settings."
    });
  }, [state.steps.length, saveTutorialProgress]);

  // Restart tutorial
  const restartTutorial = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('sprint_profiles')
        .update({
          tutorial_completed: false,
          tutorial_last_step: 0,
          tutorial_dismissed_at: null
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error restarting tutorial:', error);
        return;
      }

      setState(prev => ({
        ...prev,
        hasCompleted: false,
        currentStep: 0
      }));
      
      startTutorial();
    } catch (error) {
      console.error('Error restarting tutorial:', error);
    }
  }, [user?.id, startTutorial]);

  // Effect to handle auto-scrolling when step changes
  useEffect(() => {
    if (state.isActive && state.steps.length > 0) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        calculatePositions();
        autoScrollToCurrentStep();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [state.currentStep, state.isActive, calculatePositions, autoScrollToCurrentStep]);

  // Effect to recalculate positions after scroll completes
  useEffect(() => {
    if (state.isActive) {
      const timeoutId = setTimeout(() => {
        calculatePositions();
      }, 1300); // Slightly longer than scroll duration

      return () => clearTimeout(timeoutId);
    }
  }, [state.currentStep, calculatePositions]);

  // Set up DOM observer for position updates
  useEffect(() => {
    if (!state.isActive) return;

    calculatePositions();

    // Observe DOM changes that might affect positioning
    observerRef.current = new MutationObserver(() => {
      calculatePositions();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Handle window resize
    const handleResize = () => calculatePositions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [state.isActive, calculatePositions]);

  // Load initial state
  useEffect(() => {
    loadTutorialState();
  }, [loadTutorialState]);

  return {
    ...state,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    restartTutorial,
    currentStepData: state.steps[state.currentStep] || null,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === state.steps.length - 1,
    progress: state.steps.length > 0 ? ((state.currentStep + 1) / state.steps.length) * 100 : 0
  };
};
