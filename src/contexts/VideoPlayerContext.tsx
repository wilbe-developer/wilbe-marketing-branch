
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
  });

  const playVideo = useCallback((video: Video, playlist: Video[]) => {
    const index = playlist.findIndex(v => v.id === video.id);
    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentVideo: video,
      playlist,
      currentIndex: Math.max(0, index),
      isModalOpen: true,
      isPiPMode: false,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      isPiPMode: prev.isPlaying, // Transition to PiP if video was playing
    }));
  }, []);

  const closePiP = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPiPMode: false,
      currentVideo: null,
      playlist: [],
    }));
  }, []);

  const expandFromPiP = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      isPiPMode: false,
    }));
  }, []);

  const nextVideo = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.playlist.length) return prev;
      
      return {
        ...prev,
        currentIndex: nextIndex,
        currentVideo: prev.playlist[nextIndex],
      };
    });
  }, []);

  const previousVideo = useCallback(() => {
    setState(prev => {
      const prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) return prev;
      
      return {
        ...prev,
        currentIndex: prevIndex,
        currentVideo: prev.playlist[prevIndex],
      };
    });
  }, []);

  const setPiPSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setState(prev => ({ ...prev, pipSize: size }));
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setState(prev => ({ ...prev, autoAdvance: !prev.autoAdvance }));
  }, []);

  const contextValue: VideoPlayerContextType = {
    state,
    playVideo,
    closeModal,
    closePiP,
    expandFromPiP,
    nextVideo,
    previousVideo,
    setPiPSize,
    toggleAutoAdvance,
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
