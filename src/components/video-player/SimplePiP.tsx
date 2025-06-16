
import React, { useState, useRef, useEffect } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';
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
  const playerRef = useRef<ReactPlayer>(null);
  
  const { isPiPMode, currentVideo, playlist, currentIndex, isPlaying, videoTime } = state;

  // Position PiP in bottom right corner on mount
  useEffect(() => {
    if (isPiPMode) {
      const updatePosition = () => {
        setPosition({
          x: window.innerWidth - 320 - 16,
          y: window.innerHeight - 220 - 16 // Increased height to account for controls above
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

  const handleExpandFromPiP = () => {
    // Store current time before expanding to ensure sync
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      console.log('Expanding from PiP at time:', currentTime);
      handleVideoProgress({ played: 0, playedSeconds: currentTime, loaded: 0, loadedSeconds: 0 });
    }
    expandFromPiP();
  };

  return (
    <div 
      className="fixed bg-black rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-300"
      style={{
        width: 320,
        height: 220, // Increased to account for controls
        left: position.x,
        top: position.y,
      }}
    >
      {/* Controls Bar - Above the video */}
      <div className="flex items-center justify-between p-2 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            closePiP();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 px-2">
          <div className="text-white text-xs font-medium line-clamp-1">
            {currentVideo.title}
          </div>
          <div className="text-white/70 text-xs">
            {currentIndex + 1} of {playlist.length}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handleExpandFromPiP();
          }}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Video Player Container */}
      <div className="relative" style={{ height: 180 }}>
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
      </div>
    </div>
  );
};

export default SimplePiP;
