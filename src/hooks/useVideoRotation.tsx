
import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export const useVideoRotation = (videos: Video[], rotationInterval: number = 20000) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (videos.length === 0) return;
    
    const videoTimer = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length);
    }, rotationInterval);

    return () => clearInterval(videoTimer);
  }, [videos.length, rotationInterval]);

  return {
    currentVideoIndex,
    currentVideo: videos[currentVideoIndex] || null
  };
};
