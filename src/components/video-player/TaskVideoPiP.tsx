
import React, { useState } from 'react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, X, Maximize2, Volume2, VolumeX } from 'lucide-react';
import VideoEmbed from './VideoEmbed';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';

const TaskVideoPiP: React.FC = () => {
  const { 
    state, 
    closePiP, 
    expandFromPiP, 
    nextVideo, 
    setPiPSize 
  } = useVideoPlayer();
  
  const { isPiPMode, currentVideo, playlist, currentIndex, pipSize } = state;
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!isPiPMode || !currentVideo) return null;

  const canGoNext = currentIndex < playlist.length - 1;

  // Size configurations
  const sizeClasses = {
    small: 'w-64 h-36',
    medium: 'w-80 h-48', 
    large: 'w-96 h-60'
  };

  const buttonSizes = {
    small: 'h-6 w-6',
    medium: 'h-7 w-7',
    large: 'h-8 w-8'
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 ${sizeClasses[pipSize]} bg-black rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-200 hover:shadow-3xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <div className="relative w-full h-full">
        <VideoEmbed
          youtubeEmbedId={getYoutubeEmbedId(currentVideo.youtubeId || '')}
          title={currentVideo.title}
        />
        
        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2">
            {canGoNext && (
              <Button
                variant="ghost"
                size="sm"
                className={`${buttonSizes[pipSize]} text-white hover:bg-white/20`}
                onClick={nextVideo}
              >
                <SkipForward className={`${pipSize === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/20`}
              onClick={expandFromPiP}
            >
              <Maximize2 className={`${pipSize === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonSizes[pipSize]} text-white hover:bg-white/20`}
              onClick={closePiP}
            >
              <X className={`${pipSize === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
          </div>
        </div>

        {/* Size Control */}
        <div 
          className={`absolute top-2 left-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-1">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                className={`w-2 h-2 rounded-full transition-colors ${
                  pipSize === size ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setPiPSize(size)}
              />
            ))}
          </div>
        </div>

        {/* Video Info */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
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
      </div>
    </div>
  );
};

export default TaskVideoPiP;
