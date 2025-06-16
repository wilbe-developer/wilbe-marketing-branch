
import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: any) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
      ready: (callback: () => void) => void;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number) => void;
  destroy: () => void;
}

interface UseYouTubePlayerProps {
  videoId: string;
  containerId: string;
  onStateChange?: (state: number) => void;
  onReady?: () => void;
}

export const useYouTubePlayer = ({ 
  videoId, 
  containerId, 
  onStateChange,
  onReady 
}: UseYouTubePlayerProps) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [playerState, setPlayerState] = useState<number>(-1);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    
    window.onYouTubeIframeAPIReady = () => {
      setApiLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize player when API is loaded
  useEffect(() => {
    if (!apiLoaded || !videoId || !containerId) return;

    const initPlayer = () => {
      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(containerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              onReady?.();
            },
            onStateChange: (event: any) => {
              setPlayerState(event.data);
              onStateChange?.(event.data);
            },
          },
        });
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.YT.ready(initPlayer);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
        playerRef.current = null;
      }
    };
  }, [apiLoaded, videoId, containerId, onStateChange, onReady]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(seconds);
    }
  }, [isReady]);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current && isReady) {
      return playerRef.current.getCurrentTime();
    }
    return 0;
  }, [isReady]);

  const isPlaying = playerState === window.YT?.PlayerState?.PLAYING;
  const isPaused = playerState === window.YT?.PlayerState?.PAUSED;

  return {
    player: playerRef.current,
    isReady,
    isPlaying,
    isPaused,
    playerState,
    play,
    pause,
    seekTo,
    getCurrentTime,
  };
};
