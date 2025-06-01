
import { getYoutubeEmbedId } from "@/utils/videoPlayerUtils";

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

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  // Get YouTube embed ID from the video data
  const youtubeEmbedId = video?.youtube_id ? getYoutubeEmbedId(video.youtube_id) : null;

  if (!video) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
        <div className="relative aspect-video">
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <div className="text-sm sm:text-base">Loading video...</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
          <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
      {/* Video Player */}
      <div className="relative aspect-video">
        {youtubeEmbedId ? (
          <>
            {/* LIVE badge */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 bg-black/75 backdrop-blur-sm px-2 sm:px-3 py-1 z-10">
              <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
              <span className="text-white text-xs font-bold uppercase tracking-wide">LIVE</span>
            </div>

            {/* YouTube Embed */}
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeEmbedId}?autoplay=0&controls=1&modestbranding=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />

            {/* Duration badge */}
            {video.duration && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/90 text-white text-xs px-2 py-1 rounded-sm font-medium z-10">
                {video.duration}
              </div>
            )}
          </>
        ) : (
          // Fallback to thumbnail if no YouTube ID
          <>
            <img
              src={video.thumbnail_url || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center p-4">
                <div className="text-sm sm:text-base">Video unavailable</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Now Playing Info - Fixed height to prevent shifting */}
      <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
        <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: {video.title}</p>
        <div className="min-h-[16px] mt-1">
          {video.description && (
            <p className="text-gray-300 text-xs line-clamp-1">{video.description}</p>
          )}
        </div>
        <div className="min-h-[16px] mt-1">
          {video.presenter && (
            <p className="text-gray-400 text-xs">by {video.presenter}</p>
          )}
        </div>
      </div>
    </div>
  );
}
