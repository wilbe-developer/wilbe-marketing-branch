
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, X, Maximize2 } from 'lucide-react';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { usePiPPositioning } from '@/hooks/usePiPPositioning';

const TaskVideoPiP: React.FC = () => {
  const isMobile = useIsMobile();
  const { 
    state, 
    closePiP, 
    expandFromPiP, 
    nextVideo, 
    setPiPSize,
    togglePlayPause,
    setVideoTime
  } = useVideoPlayer();
  
  const [isHovered, setIsHovered] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const playerId = 'pip-youtube-player';

  // Extract state values
  const { isPiPMode, currentVideo, playlist, currentIndex, pipSize, isPlaying } = state;

  // PiP positioning hook - must be called before early return
  const {
    position,
    isDragging,
    isSnapping,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    getSizeConfig
  } = usePiPPositioning({ size: pipSize, isVisible: isPiPMode });

  // YouTube player integration - must be called before early return
  const {
    isReady: playerReady,
    isPlaying: youtubeIsPlaying,
    play: youtubePlay,
    pause: youtubePause,
    getCurrentTime
  } = useYouTubePlayer({
    videoId: getYoutubeEmbedId(currentVideo?.youtubeId || ''),
    containerId: playerId,
    onStateChange: (state) => {
      console.log('YouTube state change in PiP:', state);
      // Only sync state if the change is significant
      if (state === 1 && !isPlaying) { // Playing
        togglePlayPause();
      } else if (state === 2 && isPlaying) { // Paused
        togglePlayPause();
      }
    },
    onReady: () => {
      console.log('YouTube player ready in PiP, isPlaying:', isPlaying);
      // Don't auto-play on ready to avoid conflicts
    }
  });

  // Handle gesture-based dismissal on mobile - must be called before early return
  const handleSwipeGesture = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    const rect = pipRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // If swiping right from the edge, close PiP
    if (touch.clientX > rect.right - 50) {
      closePiP();
    }
  }, [isMobile, closePiP]);

  // Mouse event handlers - must be called before early return
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false);
    }
  }, [isMobile]);

  const handleTouchStart = useCallback(() => {
    if (!isMobile) return;
    setControlsVisible(true);
  }, [isMobile]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [isMobile, handleDragStart]);

  // Early return AFTER all hooks have been called
  if (!isPiPMode || !currentVideo) {
    return null;
  }

  // Sync video state with context - only when player is ready
  useEffect(() => {
    if (!playerReady) {
      console.log('Player not ready, skipping sync');
      return;
    }
    
    console.log('Syncing player state - isPlaying:', isPlaying, 'youtubeIsPlaying:', youtubeIsPlaying);
    
    if (isPlaying && !youtubeIsPlaying) {
      console.log('Starting playback');
      youtubePlay();
    } else if (!isPlaying && youtubeIsPlaying) {
      console.log('Pausing playback');
      youtubePause();
    }
  }, [isPlaying, youtubeIsPlaying, playerReady, youtubePlay, youtubePause]);

  // Update video time periodically
  useEffect(() => {
    if (!playerReady || !isPlaying) return;
    
    const interval = setInterval(() => {
      const currentTime = getCurrentTime();
      if (currentTime > 0) {
        setVideoTime(currentTime);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [playerReady, isPlaying, getCurrentTime, setVideoTime]);

  // Auto-hide controls on mobile
  useEffect(() => {
    if (!isMobile || !isPiPMode || !currentVideo) return;
    
    if (controlsVisible) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 4000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [controlsVisible, isMobile, isPiPMode, currentVideo]);

  // Handle mouse events for dragging
  useEffect(() => {
    if (isMobile || !isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd, isMobile]);

  const canGoNext = currentIndex < playlist.length - 1;
  const sizeConfig = getSizeConfig();

  // Button and icon sizes
  const buttonSizes = {
    small: isMobile ? 'h-10 w-10' : 'h-8 w-8',
    medium: isMobile ? 'h-12 w-12' : 'h-9 w-9',
    large: isMobile ? 'h-14 w-14' : 'h-10 w-10'
  };

  const iconSizes = {
    small: isMobile ? 'h-5 w-5' : 'h-4 w-4',
    medium: isMobile ? 'h-6 w-6' : 'h-5 w-5',
    large: isMobile ? 'h-7 w-7' : 'h-6 w-6'
  };

  const showControls = isMobile ? controlsVisible : isHovered;

  return (
    <div 
      ref={pipRef}
      className={`fixed bg-black rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-300 ${
        isSnapping ? 'ease-out' : isDragging ? 'cursor-grabbing' : isMobile ? '' : 'cursor-grab hover:shadow-3xl'
      }`}
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleSwipeGesture}
      onMouseDown={!isMobile ? handleMouseDown : undefined}
    >
      {/* YouTube Player */}
      <div className="relative w-full h-full">
        <div 
          id={playerId}
          className="w-full h-full"
          style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
        />
        
        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-200 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => isMobile && setControlsVisible(!controlsVisible)}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm transition-all`}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              {isPlaying ? (
                <Pause className={iconSizes[pipSize]} />
              ) : (
                <Play className={iconSizes[pipSize]} />
              )}
            </Button>
            
            {canGoNext && (
              <Button
                variant="ghost"
                size="sm"
                className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  nextVideo();
                }}
              >
                <SkipForward className={iconSizes[pipSize]} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm transition-all`}
              onClick={(e) => {
                e.stopPropagation();
                expandFromPiP();
              }}
            >
              <Maximize2 className={iconSizes[pipSize]} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm transition-all`}
              onClick={(e) => {
                e.stopPropagation();
                closePiP();
              }}
            >
              <X className={iconSizes[pipSize]} />
            </Button>
          </div>
        </div>

        {/* Size Control - Desktop only */}
        {!isMobile && (
          <div 
            className={`absolute top-2 left-2 transition-opacity duration-200 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex gap-1">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    pipSize === size ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPiPSize(size);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video Info */}
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
            {currentVideo.duration && ` • ${currentVideo.duration}`}
          </div>
        </div>

        {/* Loading indicator */}
        {!playerReady && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskVideoPiP;
