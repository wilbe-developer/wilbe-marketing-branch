
import React from 'react';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialTooltip } from './TutorialTooltip';
import { useTutorialContext } from './TutorialProvider';

export const Tutorial: React.FC = () => {
  const { isActive } = useTutorialContext();

  if (!isActive) return null;

  return (
    <>
      <TutorialOverlay />
      <TutorialTooltip />
    </>
  );
};
