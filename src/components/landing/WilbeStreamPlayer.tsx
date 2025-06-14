
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

// Only allow videos from these 5 specific presenters - CORRECTED IDs
const ALLOWED_VIDEO_IDS = [
  "c3992a10-b683-4df5-be13-4519197152bf", // Prachee Avasthi - "Building the Future of Science: The Arcadia Way"
  "8703142d-8645-4905-bf1a-c596d7e86f1c", // Nimish - "Career Paths in Biotech: Nimish's Insider Story"
  "0d78c22e-3107-4aec-835b-1ce860a45213", // Sandy Kory - "Storytelling, Talent & Investing in Science Startups"
  "fde1035c-ee81-4329-9d5f-656647096992", // Albert Wenger - "Conversations at the Crossroads"
  "cf19a0eb-c28b-4d04-8436-816746df70e6"  // Chris O'Neill - "The Entrepreneurial Mindset: An Insider's Guide"
];

export default function WilbeStreamPlayer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the countdown timer hook for June 17, 2025 at 12:00 PM ET
  const timeLeft = useCountdownTimer('2025-06-17T16:00:00Z');

  // Load videos from the same source as FoundersStories but filter to specific IDs
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();
        
        console.log("Total videos fetched:", videosData.length);
        console.log("Looking for video IDs:", ALLOWED_VIDEO_IDS);
        
        // Filter to only include videos from the 5 specific presenters
        const allowedVideos = videosData
          .filter(video => {
            const isAllowed = ALLOWED_VIDEO_IDS.includes(video.id);
            const hasYouTubeId = !!video.youtube_id;
            
            if (isAllowed) {
              console.log(`Found allowed video: ${video.title} (ID: ${video.id}) - YouTube ID: ${video.youtube_id}`);
            }
            
            return isAllowed && hasYouTubeId;
          })
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        console.log("Filtered videos for stream player:", allowedVideos.length, allowedVideos);
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
                    {loading ? "Loading videos..." : `No videos available (${videos.length} found)`}
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
                  <div className="text-sm sm:text-base">No current video selected</div>
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
