import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Video } from '@/types';

interface VideoPlayerState {
  isPlaying: boolean;
  currentVideo: Video | null;
  playlist: Video[];
  currentIndex: number;
  isModalOpen: boolean;
  isPiPMode: boolean;
  pipSize: 'small' | 'medium' | 'large';
  autoAdvance: boolean;
  videoTime: number;
}

interface VideoPlayerContextType {
  state: VideoPlayerState;
  playVideo: (video: Video, playlist: Video[]) => void;
  closeModal: () => void;
  closePiP: () => void;
  expandFromPiP: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  setPiPSize: (size: 'small' | 'medium' | 'large') => void;
  toggleAutoAdvance: () => void;
  togglePlayPause: () => void;
  setVideoTime: (time: number) => void;
  jumpToVideo: (index: number) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentVideo: null,
    playlist: [],
    currentIndex: 0,
    isModalOpen: false,
    isPiPMode: false,
    pipSize: 'medium',
    autoAdvance: true,
    videoTime: 0,
  });

  const playVideo = useCallback((video: Video, playlist: Video[]) => {
    const index = playlist.findIndex(v => v.id === video.id);
    console.log('Playing video:', video.title, 'in playlist of', playlist.length);
    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentVideo: video,
      playlist,
      currentIndex: Math.max(0, index),
      isModalOpen: true,
      isPiPMode: false,
      videoTime: 0,
    }));
  }, []);

  const closeModal = useCallback(() => {
    console.log('Closing modal, transitioning to PiP. Current playing state:', state.isPlaying);
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      isPiPMode: prev.isPlaying && !!prev.currentVideo,
    }));
  }, [state.isPlaying]);

  const closePiP = useCallback(() => {
    console.log('Closing PiP completely');
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPiPMode: false,
      currentVideo: null,
      playlist: [],
      videoTime: 0,
    }));
  }, []);

  const expandFromPiP = useCallback(() => {
    console.log('Expanding from PiP back to modal');
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      isPiPMode: false,
    }));
  }, []);

  const nextVideo = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.playlist.length) {
        console.log('Already at last video, cannot go next');
        return prev;
      }
      
      console.log('Moving to next video:', prev.playlist[nextIndex]?.title);
      return {
        ...prev,
        currentIndex: nextIndex,
        currentVideo: prev.playlist[nextIndex],
        videoTime: 0,
        isPlaying: true, // Keep playing when switching videos
      };
    });
  }, []);

  const previousVideo = useCallback(() => {
    setState(prev => {
      const prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) {
        console.log('Already at first video, cannot go previous');
        return prev;
      }
      
      console.log('Moving to previous video:', prev.playlist[prevIndex]?.title);
      return {
        ...prev,
        currentIndex: prevIndex,
        currentVideo: prev.playlist[prevIndex],
        videoTime: 0,
        isPlaying: true, // Keep playing when switching videos
      };
    });
  }, []);

  const jumpToVideo = useCallback((index: number) => {
    setState(prev => {
      if (index < 0 || index >= prev.playlist.length) {
        console.log('Invalid video index:', index);
        return prev;
      }
      
      console.log('Jumping to video:', prev.playlist[index]?.title);
      return {
        ...prev,
        currentIndex: index,
        currentVideo: prev.playlist[index],
        videoTime: 0,
        isPlaying: true, // Keep playing when jumping to video
      };
    });
  }, []);

  const setPiPSize = useCallback((size: 'small' | 'medium' | 'large') => {
    console.log('Setting PiP size to:', size);
    setState(prev => ({ ...prev, pipSize: size }));
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setState(prev => {
      console.log('Toggling auto advance from:', prev.autoAdvance, 'to:', !prev.autoAdvance);
      return { ...prev, autoAdvance: !prev.autoAdvance };
    });
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => {
      const newIsPlaying = !prev.isPlaying;
      console.log('Toggling play/pause from:', prev.isPlaying, 'to:', newIsPlaying);
      return { ...prev, isPlaying: newIsPlaying };
    });
  }, []);

  const setVideoTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, videoTime: time }));
  }, []);

  const contextValue: VideoPlayerContextType = {
    state,
    playVideo,
    closeModal,
    closePiP,
    expandFromPiP,
    nextVideo,
    previousVideo,
    jumpToVideo,
    setPiPSize,
    toggleAutoAdvance,
    togglePlayPause,
    setVideoTime,
  };

  return (
    <VideoPlayerContext.Provider value={contextValue}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};
