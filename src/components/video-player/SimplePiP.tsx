
import React, { useState, useRef, useEffect } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, X, Maximize2 } from 'lucide-react';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';
import ReactPlayer from 'react-player/youtube';

const SimplePiP: React.FC = () => {
  const { 
    state, 
    closePiP, 
    expandFromPiP, 
    nextVideo, 
    togglePlayPause,
    handleVideoProgress
  } = useVideoPlayer();
  
  const [showControls, setShowControls] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 80 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const playerRef = useRef(null);
  
  const { isPiPMode, currentVideo, playlist, currentIndex, isPlaying, videoTime } = state;

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showControls]);

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

  const handleTap = () => {
    setShowControls(!showControls);
  };

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
      onClick={handleTap}
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
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              playsinline: 1,
              start: Math.floor(videoTime)
            }
          }
        }}
      />
      
      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          {canGoNext && (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                nextVideo();
              }}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              expandFromPiP();
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              closePiP();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video info */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
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
