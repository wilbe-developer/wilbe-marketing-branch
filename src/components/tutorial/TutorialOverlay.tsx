
import React from 'react';
import { useTutorialContext } from './TutorialProvider';

export const TutorialOverlay: React.FC = () => {
  const { isActive, currentStepData, positions } = useTutorialContext();

  if (!isActive || !currentStepData) return null;

  // Don't show overlay for the welcome step (first step that targets dashboard-container)
  if (currentStepData.id === 'welcome') return null;

  const targetPosition = positions[currentStepData.targetElement];
  
  if (!targetPosition) return null;

  // Add padding around the highlighted area
  const padding = 6;
  const highlightLeft = Math.max(0, targetPosition.left - padding);
  const highlightTop = Math.max(0, targetPosition.top - padding);
  const highlightRight = Math.min(window.innerWidth, targetPosition.right + padding);
  const highlightBottom = Math.min(window.innerHeight, targetPosition.bottom + padding);

  // Check if the element is likely circular (like an avatar)
  const isCircular = currentStepData.targetElement === 'profile-avatar' || 
                    (targetPosition.width === targetPosition.height && targetPosition.width < 100);

  // Create the highlight cutout style with rounded corners
  const borderRadius = isCircular ? '50%' : '8px';
  
  return (
    <>
      {/* Main overlay with cutout */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 pointer-events-none"
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${highlightLeft}px 100%, 
            ${highlightLeft}px ${highlightTop}px, 
            ${highlightRight}px ${highlightTop}px, 
            ${highlightRight}px ${highlightBottom}px, 
            ${highlightLeft}px ${highlightBottom}px, 
            ${highlightLeft}px 100%, 
            100% 100%, 
            100% 0%
          )`
        }}
      />
      
      {/* Rounded highlight border overlay */}
      <div
        className="fixed z-40 pointer-events-none border-2 border-brand-pink/60 shadow-lg"
        style={{
          left: `${highlightLeft}px`,
          top: `${highlightTop}px`,
          width: `${highlightRight - highlightLeft}px`,
          height: `${highlightBottom - highlightTop}px`,
          borderRadius: borderRadius,
          boxShadow: '0 0 0 2px rgba(236, 72, 153, 0.3), 0 0 20px rgba(236, 72, 153, 0.2)'
        }}
      />
    </>
  );
};
