
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';
import VideoEmbed from './VideoEmbed';
import { Play, SkipForward, SkipBack, X, Settings } from 'lucide-react';
import { getYoutubeEmbedId } from '@/utils/videoPlayerUtils';

const TaskVideoPlayerModal: React.FC = () => {
  const { state, closeModal, nextVideo, previousVideo, toggleAutoAdvance } = useVideoPlayer();
  const { isModalOpen, currentVideo, playlist, currentIndex, autoAdvance } = state;
  
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isModalOpen || !currentVideo || !autoAdvance) return;

    // Listen for video end to auto-advance (simplified approach)
    const handleVideoEnd = () => {
      if (currentIndex < playlist.length - 1) {
        nextVideo();
      }
    };

    // This is a simplified approach - in a real implementation, you'd use YouTube API
    // to properly detect video end events
    const timer = setTimeout(() => {
      // Auto-advance after estimated video duration (if available)
      // This is a fallback - proper implementation would use YouTube Player API
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentVideo, currentIndex, playlist.length, autoAdvance, nextVideo, isModalOpen]);

  if (!currentVideo) return null;

  const upNext = playlist.slice(currentIndex + 1);
  const canGoNext = currentIndex < playlist.length - 1;
  const canGoPrev = currentIndex > 0;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => closeModal()}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold line-clamp-1">
                {currentVideo.title}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col">
              {/* Video Player */}
              <div className="flex-1 bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-3xl">
                  <VideoEmbed
                    youtubeEmbedId={getYoutubeEmbedId(currentVideo.youtubeId || '')}
                    title={currentVideo.title}
                  />
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousVideo}
                      disabled={!canGoPrev}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextVideo}
                      disabled={!canGoNext}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={autoAdvance ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAutoAdvance}
                    >
                      Auto-play next
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Video {currentIndex + 1} of {playlist.length}
                  {currentVideo.presenter && ` • ${currentVideo.presenter}`}
                  {currentVideo.duration && ` • ${currentVideo.duration}`}
                </div>
              </div>
            </div>

            {/* Sidebar - Up Next */}
            {upNext.length > 0 && (
              <div className="w-80 border-l bg-gray-50 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Up Next</h3>
                  <div className="space-y-3">
                    {upNext.map((video, index) => (
                      <div
                        key={video.id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                        onClick={() => {
                          // Jump to this video
                          const targetIndex = currentIndex + 1 + index;
                          // We'll need to update the context to support jumping to specific index
                        }}
                      >
                        <div className="flex-shrink-0 relative">
                          <img
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {video.presenter}
                          </p>
                        </div>
                      </div>
                    ))}
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
