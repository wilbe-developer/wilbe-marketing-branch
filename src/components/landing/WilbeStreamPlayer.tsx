
import { useState, useEffect } from "react";
import { fetchVideos } from "@/services/videoService";
import VideoPlayer from "./VideoPlayer";
import NextLiveEvent from "./NextLiveEvent";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useVideoRotation } from "@/hooks/useVideoRotation";

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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the countdown timer hook for June 10, 2025 at 12:00 PM ET
  const timeLeft = useCountdownTimer('2025-06-10T16:00:00Z');

  // Load videos from the same source as FoundersStories
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
        // Fallback to empty array if fetch fails
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Use the video rotation hook
  const { currentVideo } = useVideoRotation(videos, 20000);

  // Show loading state or fallback if no videos
  if (loading || videos.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="grid grid-rows-[auto_auto] gap-3 sm:gap-4 h-full">
          {/* Video Player Container - Loading/Fallback */}
          <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
            <div className="relative aspect-video">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="text-sm sm:text-base">
                    {loading ? "Loading videos..." : "No videos available"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Now Playing Info - Fixed height */}
            <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
              <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: Loading...</p>
              <div className="h-4"></div>
              <div className="h-4"></div>
            </div>
          </div>

          {/* Next Live Event - Fixed position */}
          <NextLiveEvent timeLeft={timeLeft} />
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="grid grid-rows-[auto_auto] gap-3 sm:gap-4 h-full">
          <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
            <div className="relative aspect-video">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="text-sm sm:text-base">No videos available</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
              <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: Loading...</p>
            </div>
          </div>
          <NextLiveEvent timeLeft={timeLeft} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-rows-[auto_auto] gap-3 sm:gap-4 h-full">
        <VideoPlayer video={currentVideo} />
        <NextLiveEvent timeLeft={timeLeft} />
      </div>
    </div>
  );
}
