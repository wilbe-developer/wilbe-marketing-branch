
import React from 'react';
import ReactPlayer from 'react-player/youtube';

interface VideoEmbedProps {
  youtubeEmbedId: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onReady?: () => void;
  playing?: boolean;
  width?: string | number;
  height?: string | number;
  playerRef?: React.RefObject<ReactPlayer>;
  startTime?: number;
}

const VideoEmbed = ({ 
  youtubeEmbedId, 
  title, 
  autoplay = false, 
  controls = true,
  onProgress,
  onPlay,
  onPause,
  onEnded,
  onReady,
  playing,
  width = '100%',
  height = '100%',
  playerRef,
  startTime = 0
}: VideoEmbedProps) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeEmbedId}`;

  const handlePlay = () => {
    console.log('Video started playing');
    onPlay?.();
  };

  const handlePause = () => {
    console.log('Video paused');
    onPause?.();
  };

  const handleReady = () => {
    console.log('Video player is ready');
    onReady?.();
  };

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={youtubeUrl}
        playing={playing ?? autoplay}
        controls={controls}
        width={width}
        height={height}
        onProgress={onProgress}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={onEnded}
        onReady={handleReady}
        config={{
          playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1,
            start: Math.floor(startTime)
          }
        }}
      />
    </div>
  );
};

export default VideoEmbed;
