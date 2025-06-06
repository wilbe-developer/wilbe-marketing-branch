
import { TutorialStep } from "@/types/tutorial";

export const baseTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to your BSF Dashboard! 🚀',
    content: 'This is go time! Your BSF is where you transform your vision into reality. This is your mission control for building the future you see. Let me show you how to force that future into existence!',
    targetElement: 'dashboard-container',
    position: 'bottom',
    showOn: 'both'
  },
  {
    id: 'sprint-timer',
    title: 'Your 10-Day BSF Timer ⏰',
    content: 'This is crucial! You have exactly 10 days to complete your BSF. Start your timer now to begin the countdown and make every moment count.',
    targetElement: 'sprint-countdown',
    position: 'bottom',
    showOn: 'both',
    condition: (context) => !context.isSharedSprint || context.canManage
  },
  {
    id: 'task-list',
    title: 'Your BSF Challenges',
    content: 'These are your BSF challenges - your roadmap to success. Click on any task to start working on it. Completed tasks will show a green checkmark.',
    targetElement: 'task-list',
    position: 'top',
    showOn: 'both'
  },
  {
    id: 'progress-overview',
    title: 'Track Your Progress',
    content: 'This progress bar shows how many BSF challenges you\'ve completed. Your goal is to complete all tasks to finish your BSF journey.',
    targetElement: 'progress-display',
    position: 'bottom',
    showOn: 'both'
  },
  {
    id: 'data-room-button',
    title: 'Your Data Room',
    content: 'This is your public-facing data room where you can showcase your work to investors and collaborators. Click here anytime to preview how others see your progress.',
    targetElement: 'data-room-button',
    position: 'bottom',
    showOn: 'both'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions & Support',
    content: 'These buttons give you quick access to getting help when stuck, requesting mentor calls, and managing your team. Use them whenever you need support.',
    targetElement: 'quick-actions',
    position: 'bottom',
    showOn: 'both',
    condition: (context) => !context.isSharedSprint || context.canManage
  },
  {
    id: 'assessment-ready',
    title: 'Ready for Assessment',
    content: 'When you\'ve completed your BSF tasks and feel ready to present your project, use this button to schedule your assessment call with our team.',
    targetElement: 'assessment-button',
    position: 'bottom',
    showOn: 'both',
    condition: (context) => !context.isSharedSprint || context.canManage
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    content: 'Use the Share button to invite team members to collaborate on your BSF or make your data room public to share with investors.',
    targetElement: 'collaborate-button',
    position: 'bottom',
    showOn: 'both',
    condition: (context) => context.canManage
  },
  {
    id: 'community-navigation',
    title: 'Connect with the Community',
    content: 'Click here to access the community forum where you can get help, share insights, and connect with other founders on their BSF journey.',
    targetElement: 'community-nav-button',
    position: 'bottom',
    showOn: 'both'
  },
  {
    id: 'profile-settings',
    title: 'Your Profile & Settings',
    content: 'Click on your avatar to access profile settings, account management, and other important features.',
    targetElement: 'profile-avatar',
    position: 'bottom',
    showOn: 'both'
  },
  {
    id: 'final-motivation',
    title: 'Time to Build the Future! 💪',
    content: 'You now have everything you need to succeed. Remember: this BSF isn\'t just about completing tasks - it\'s about forcing the future you envision into reality. Your first task is highlighted below. Let\'s go!',
    targetElement: 'first-task-card',
    position: 'top',
    showOn: 'both'
  }
];

export const getMobileSteps = (): TutorialStep[] => {
  return baseTutorialSteps
    .filter(step => step.showOn === 'both' || step.showOn === 'mobile')
    .map(step => ({
      ...step,
      // Adjust positions for mobile if needed
      position: step.id === 'task-list' ? 'bottom' : step.position
    }));
};

export const getDesktopSteps = (): TutorialStep[] => {
  return baseTutorialSteps.filter(step => step.showOn === 'both' || step.showOn === 'desktop');
};
