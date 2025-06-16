
import React, { useState, useRef, useEffect } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { X, PictureInPicture } from 'lucide-react';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';
import ReactPlayer from 'react-player/youtube';

const SimplePiP: React.FC = () => {
  const { 
    state, 
    closePiP, 
    expandFromPiP, 
    nextVideo,
    handleVideoProgress
  } = useVideoPlayer();
  
  const [position, setPosition] = useState({ x: 16, y: 80 });
  const playerRef = useRef(null);
  
  const { isPiPMode, currentVideo, playlist, currentIndex, isPlaying, videoTime } = state;

  // Position PiP in bottom right corner on mount
  useEffect(() => {
    if (isPiPMode) {
      const updatePosition = () => {
        setPosition({
          x: window.innerWidth - 320 - 16,
          y: window.innerHeight - 200 - 16
        });
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isPiPMode]);

  if (!isPiPMode || !currentVideo) {
    return null;
  }

  const canGoNext = currentIndex < playlist.length - 1;
  const videoId = getYoutubeEmbedId(currentVideo.youtubeId || '');
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleVideoEnd = () => {
    if (canGoNext) {
      nextVideo();
    }
  };

  return (
    <div 
      className="fixed bg-black rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-300"
      style={{
        width: 320,
        height: 180,
        left: position.x,
        top: position.y,
      }}
    >
      {/* ReactPlayer for better control */}
      <ReactPlayer
        ref={playerRef}
        url={youtubeUrl}
        playing={isPlaying}
        width="100%"
        height="100%"
        controls={false}
        onProgress={handleVideoProgress}
        onEnded={handleVideoEnd}
        config={{
          playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1,
            start: Math.floor(videoTime)
          }
        }}
      />
      
      {/* Always visible controls - positioned to avoid YouTube overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Close button - top left, avoiding YouTube channel info */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 h-8 w-8 p-0 text-white hover:bg-black/60 bg-black/40 backdrop-blur-sm pointer-events-auto z-10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            closePiP();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Expand button - top right, avoiding YouTube options menu */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 text-white hover:bg-black/60 bg-black/40 backdrop-blur-sm pointer-events-auto z-10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            expandFromPiP();
          }}
        >
          <PictureInPicture className="h-4 w-4" />
        </Button>
      </div>

      {/* Video info - only show on hover to reduce clutter */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="text-white text-xs font-medium line-clamp-1">
          {currentVideo.title}
        </div>
        <div className="text-white/70 text-xs">
          {currentIndex + 1} of {playlist.length}
        </div>
      </div>
    </div>
  );
};

export default SimplePiP;
