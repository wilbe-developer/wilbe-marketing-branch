import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import VideoEmbed from './VideoEmbed';
import { Play, Pause, SkipForward, SkipBack, X, PictureInPicture } from 'lucide-react';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import ReactPlayer from 'react-player/youtube';

const TaskVideoPlayerModal: React.FC = () => {
  const isMobile = useIsMobile();
  const playerRef = useRef<ReactPlayer>(null);
  const { 
    state, 
    closeModal, 
    nextVideo, 
    previousVideo, 
    jumpToVideo,
    toggleAutoAdvance,
    togglePlayPause,
    handleVideoProgress,
    enterPiP
  } = useVideoPlayer();
  
  const { isModalOpen, currentVideo, playlist, currentIndex, autoAdvance, isPlaying, videoTime, expandingFromPiP } = state;

  // Handle video seeking when modal opens, especially from PiP
  useEffect(() => {
    if (isModalOpen && playerRef.current && videoTime > 0) {
      console.log('Modal opened with video time:', videoTime, 'expanding from PiP:', expandingFromPiP);
      
      const seekToTime = () => {
        if (playerRef.current) {
          console.log('Seeking to time in modal:', videoTime);
          playerRef.current.seekTo(videoTime, 'seconds');
        }
      };

      // If expanding from PiP, seek immediately and also after a short delay
      if (expandingFromPiP) {
        seekToTime();
        const timer = setTimeout(seekToTime, 500);
        return () => clearTimeout(timer);
      } else {
        // For regular modal opening, use longer delay
        const timer = setTimeout(seekToTime, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isModalOpen, videoTime, expandingFromPiP]);

  // Reset expanding flag after modal is fully open
  useEffect(() => {
    if (isModalOpen && expandingFromPiP) {
      const timer = setTimeout(() => {
        // Clear the expanding flag after the modal has had time to load
        console.log('Clearing expandingFromPiP flag');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, expandingFromPiP]);

  // ... keep existing code (auto-advance effect)
  useEffect(() => {
    if (!isModalOpen || !currentVideo || !autoAdvance) return;

    console.log('Auto-advance is enabled for video:', currentVideo.title);
  }, [currentVideo, currentIndex, playlist.length, autoAdvance, nextVideo, isModalOpen]);

  if (!currentVideo) return null;

  const upNext = playlist.slice(currentIndex + 1);
  const canGoNext = currentIndex < playlist.length - 1;
  const canGoPrev = currentIndex > 0;

  const handleNativePiPClick = async () => {
    try {
      if (playerRef.current) {
        const internalPlayer = playerRef.current.getInternalPlayer();
        const iframe = internalPlayer?.getIframe?.();
        
        if (iframe && document.pictureInPictureEnabled) {
          // For YouTube iframes, we'll transition to our custom PiP since native PiP doesn't work with iframes
          enterPiP();
        } else {
          console.log('Native PiP not supported for YouTube iframes, using custom PiP');
          enterPiP();
        }
      }
    } catch (error) {
      console.error('PiP error:', error);
      // Fallback to custom PiP
      enterPiP();
    }
  };

  const handleVideoEnd = () => {
    if (autoAdvance && canGoNext) {
      nextVideo();
    }
  };

  const handlePlay = () => {
    // Only update state if it's different to avoid loops
    if (!isPlaying) {
      togglePlayPause();
    }
  };

  const handlePause = () => {
    // Only update state if it's different to avoid loops
    if (isPlaying) {
      togglePlayPause();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent 
        className={`${isMobile ? 'max-w-full h-full p-0 m-0' : 'max-w-6xl w-full h-[85vh] p-0'}`}
        hideCloseButton={true}
      >
        <div className="flex flex-col h-full">
          {/* Custom Header with Close Button */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <h2 className="text-lg font-semibold line-clamp-1 flex-1 pr-4">
              {currentVideo.title}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleNativePiPClick}>
                <PictureInPicture className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} flex-1 overflow-hidden`}>
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col">
              {/* Video Player */}
              <div className={`flex-1 bg-black flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
                <div className="w-full max-w-4xl">
                  <VideoEmbed
                    youtubeEmbedId={getYoutubeEmbedId(currentVideo.youtubeId || '')}
                    title={currentVideo.title}
                    playing={isPlaying}
                    onProgress={handleVideoProgress}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleVideoEnd}
                    playerRef={playerRef}
                  />
                </div>
              </div>

              {/* Video Controls */}
              <div className={`${isMobile ? 'p-3' : 'p-4'} border-t bg-gray-50`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={previousVideo}
                      disabled={!canGoPrev}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={nextVideo}
                      disabled={!canGoNext}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {!isMobile && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant={autoAdvance ? "default" : "outline"}
                        size="sm"
                        onClick={toggleAutoAdvance}
                      >
                        Auto-play next
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  Video {currentIndex + 1} of {playlist.length}
                  {currentVideo.presenter && ` • ${currentVideo.presenter}`}
                  {currentVideo.duration && ` • ${currentVideo.duration}`}
                </div>
                
                {isMobile && (
                  <div className="mt-2">
                    <Button
                      variant={autoAdvance ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAutoAdvance}
                      className="text-xs"
                    >
                      Auto-play next
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Up Next - Sidebar on Desktop, Below on Mobile */}
            {upNext.length > 0 && (
              <div className={`${
                isMobile 
                  ? 'border-t bg-gray-50' 
                  : 'w-80 border-l bg-gray-50'
              } overflow-y-auto`}>
                <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
                  <h3 className="font-medium mb-3">Up Next</h3>
                  <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                    {upNext.slice(0, isMobile ? 3 : upNext.length).map((video, index) => (
                      <div
                        key={video.id}
                        className={`flex gap-3 ${isMobile ? 'p-2' : 'p-2'} rounded-lg hover:bg-white cursor-pointer transition-colors`}
                        onClick={() => jumpToVideo(currentIndex + 1 + index)}
                      >
                        <div className="flex-shrink-0 relative">
                          <img
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            className={`${isMobile ? 'w-16 h-10' : 'w-20 h-12'} object-cover rounded`}
                          />
                          {video.duration && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                              {video.duration}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium line-clamp-2 mb-1`}>
                            {video.title}
                          </h4>
                          {video.presenter && (
                            <p className="text-xs text-gray-500">
                              {video.presenter}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isMobile && upNext.length > 3 && (
                      <div className="text-center text-xs text-gray-500 pt-2">
                        +{upNext.length - 3} more videos
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskVideoPlayerModal;
