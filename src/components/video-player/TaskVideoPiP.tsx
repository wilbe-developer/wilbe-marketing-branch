
import React, { useState, useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, X, Maximize2 } from 'lucide-react';
import VideoEmbed from './VideoEmbed';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const TaskVideoPiP: React.FC = () => {
  const isMobile = useIsMobile();
  const { 
    state, 
    closePiP, 
    expandFromPiP, 
    nextVideo, 
    setPiPSize,
    togglePlayPause 
  } = useVideoPlayer();
  
  const { isPiPMode, currentVideo, playlist, currentIndex, pipSize, isPlaying } = state;
  const [isHovered, setIsHovered] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Early return to prevent hooks issues
  if (!isPiPMode || !currentVideo) return null;

  const canGoNext = currentIndex < playlist.length - 1;

  // Auto-hide controls on mobile
  useEffect(() => {
    if (!isMobile) return;
    
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
  }, [controlsVisible, isMobile]);

  // Size configurations with mobile-first approach
  const sizeClasses = {
    small: isMobile ? 'w-48 h-28' : 'w-64 h-36',
    medium: isMobile ? 'w-64 h-40' : 'w-80 h-48', 
    large: isMobile ? 'w-80 h-48' : 'w-96 h-60'
  };

  const buttonSizes = {
    small: isMobile ? 'h-12 w-12' : 'h-8 w-8',
    medium: isMobile ? 'h-12 w-12' : 'h-9 w-9',
    large: isMobile ? 'h-14 w-14' : 'h-10 w-10'
  };

  const iconSizes = {
    small: isMobile ? 'h-6 w-6' : 'h-4 w-4',
    medium: isMobile ? 'h-6 w-6' : 'h-5 w-5',
    large: isMobile ? 'h-7 w-7' : 'h-6 w-6'
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setControlsVisible(true);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const showControls = isMobile ? controlsVisible : isHovered;

  // Drag functionality for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    const rect = pipRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - rect.width, e.clientX - offsetX)),
          y: Math.max(0, Math.min(window.innerHeight - rect.height, e.clientY - offsetY))
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <div 
      ref={pipRef}
      className={`fixed ${sizeClasses[pipSize]} bg-black rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-200 hover:shadow-3xl ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={isMobile ? { bottom: 16, right: 16 } : { bottom: position.y, right: position.x }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onMouseDown={!isMobile ? handleMouseDown : undefined}
    >
      {/* Video */}
      <div className="relative w-full h-full">
        <VideoEmbed
          youtubeEmbedId={getYoutubeEmbedId(currentVideo.youtubeId || '')}
          title={currentVideo.title}
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
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm`}
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
                className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm`}
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
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm`}
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
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/30 bg-black/40 backdrop-blur-sm`}
              onClick={(e) => {
                e.stopPropagation();
                closePiP();
              }}
            >
              <X className={iconSizes[pipSize]} />
            </Button>
          </div>
        </div>

        {/* Size Control - Only on desktop */}
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
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent ${
            isMobile ? 'p-2' : 'p-2'
          } transition-opacity duration-200 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`text-white ${isMobile ? 'text-xs' : 'text-xs'} font-medium line-clamp-1`}>
            {currentVideo.title}
          </div>
          <div className={`text-white/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {currentIndex + 1} of {playlist.length}
            {currentVideo.duration && ` • ${currentVideo.duration}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskVideoPiP;
