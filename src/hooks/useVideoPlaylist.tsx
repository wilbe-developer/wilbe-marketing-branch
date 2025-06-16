
import { useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
  youtube_id?: string;
}

export const useVideoPlaylist = (videos: Video[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get current video
  const currentVideo = videos.length > 0 ? videos[currentIndex] : null;

  // Move to next video
  const nextVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  // Move to previous video
  const previousVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
  };

  // Auto-advance when video ends
  const handleVideoEnd = () => {
    nextVideo();
  };

  // Reset to first video when videos list changes
  useEffect(() => {
    if (videos.length > 0) {
      setCurrentIndex(0);
    }
  }, [videos]);

  return {
    currentVideo,
    currentIndex,
    nextVideo,
    previousVideo,
    handleVideoEnd,
    isPlaying,
    setIsPlaying,
    totalVideos: videos.length
  };
};
