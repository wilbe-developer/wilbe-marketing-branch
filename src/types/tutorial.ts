
export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElement: string; // data-tutorial-id
  position: 'top' | 'bottom' | 'left' | 'right';
  showOn: 'both' | 'mobile' | 'desktop';
  condition?: (context: TutorialContext) => boolean;
}

export interface TutorialContext {
  isSharedSprint: boolean;
  canManage: boolean;
  isMobile: boolean;
  dataRoomUserId?: string;
  completedTasks: number;
  totalTasks: number;
}

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  hasCompleted: boolean;
  positions: Record<string, DOMRect>;
  isLoading: boolean;
}
