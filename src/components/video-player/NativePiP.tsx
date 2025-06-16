
import React, { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const NativePiP: React.FC = () => {
  const { state, closePiP } = useVideoPlayer();
  const { isPiPMode, currentVideo } = state;
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPiPMode && currentVideo && pipVideoRef.current) {
      const video = pipVideoRef.current;
      
      const enterPiP = async () => {
        try {
          if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
            await video.requestPictureInPicture();
          }
        } catch (error) {
          console.error('Failed to enter Picture-in-Picture mode:', error);
          closePiP();
        }
      };

      const handleLeavePiP = () => {
        closePiP();
      };

      video.addEventListener('leavepictureinpicture', handleLeavePiP);
      enterPiP();

      return () => {
        video.removeEventListener('leavepictureinpicture', handleLeavePiP);
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture().catch(console.error);
        }
      };
    }
  }, [isPiPMode, currentVideo, closePiP]);

  if (!isPiPMode || !currentVideo) {
    return null;
  }

  // This is a hidden video element that will be used for native PiP
  // The actual YouTube content will be handled through the iframe when possible
  return (
    <video
      ref={pipVideoRef}
      style={{ display: 'none' }}
      controls
      muted
      playsInline
    />
  );
};

export default NativePiP;
