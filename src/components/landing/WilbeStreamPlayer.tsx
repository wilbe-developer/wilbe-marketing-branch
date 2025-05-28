
import { useState, useEffect, useRef, useCallback } from "react"
import { fetchVideos } from "@/services/videoService"

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function WilbeStreamPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();
        
        // Sort by created_at and take all published videos
        const sortedVideos = videosData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setVideos(sortedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Auto-advance to next video every 10 seconds
  useEffect(() => {
    if (videos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 seconds per video

    return () => clearInterval(interval);
  }, [videos.length]);

  if (loading || videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <div className="relative bg-black overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse w-16 h-16 rounded-full bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative bg-black overflow-hidden shadow-2xl rounded-lg">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
            <img
              src={currentVideo.thumbnail_url || "/placeholder.svg"}
              alt={currentVideo.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Minimal branding overlay */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              <div>
                <div className="text-white font-bold text-sm uppercase tracking-wide">Wilbe STREAM</div>
                <div className="text-gray-300 text-xs">Science Leaders</div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((currentVideoIndex + 1) / videos.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current video info below player */}
        <div className="bg-gray-900 p-4 mt-2 rounded-lg">
          <div className="text-green-500 text-xs font-bold uppercase tracking-wide mb-1">NOW PLAYING</div>
          <h3 className="text-white font-bold text-lg leading-tight mb-2">
            {currentVideo.title}
          </h3>
          {currentVideo.description && (
            <p className="text-gray-300 text-sm line-clamp-2">
              {currentVideo.description}
            </p>
          )}
          {currentVideo.presenter && (
            <p className="text-gray-400 text-xs mt-2">
              by {currentVideo.presenter}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
