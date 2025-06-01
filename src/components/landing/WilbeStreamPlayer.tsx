
import { useState, useEffect } from "react";
import { fetchVideos } from "@/services/videoService";
import VideoPlayer from "./VideoPlayer";
import NextLiveEvent from "./NextLiveEvent";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useVideoPlaylist } from "@/hooks/useVideoPlaylist";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
  youtube_id?: string; // Use youtube_id to match database field
}

// Only allow videos from these 5 specific presenters
const ALLOWED_VIDEO_IDS = [
  "ce26f525-f39f-2bf4-2d49-65a47d48700c", // Prachee Avasthi
  "ce26f529-0967-e764-0841-dab85692cbcd", // Nimish
  "ce26f531-2cb4-300a-a44d-44a68819391", // Sandy
  "ce26f553-d88b-ab8d-e945-bc9d54a666b5", // Albert
  "ce26f574-1f45-09d4-3646-31af35474aab"  // Chris
];

export default function WilbeStreamPlayer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the countdown timer hook for June 10, 2025 at 12:00 PM ET
  const timeLeft = useCountdownTimer('2025-06-10T16:00:00Z');

  // Load videos from the same source as FoundersStories but filter to specific IDs
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();
        
        // Filter to only include videos from the 5 specific presenters
        const allowedVideos = videosData
          .filter(video => ALLOWED_VIDEO_IDS.includes(video.id) && video.youtube_id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        console.log("Loaded filtered videos for stream player:", allowedVideos);
        setVideos(allowedVideos);
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

  // Use the video playlist hook instead of rotation
  const { currentVideo, handleVideoEnd } = useVideoPlaylist(videos);

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
        <VideoPlayer video={currentVideo} onVideoEnd={handleVideoEnd} />
        <NextLiveEvent timeLeft={timeLeft} />
      </div>
    </div>
  );
}
