
import { useState, useEffect } from "react";
import { fetchVideos } from "@/services/videoService";
import { formatDistanceToNow } from "date-fns";
import { Clock, Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function LatestContentFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestContent = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();
        
        // Sort by created_at and take the latest 6 videos
        const sortedVideos = videosData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        
        setVideos(sortedVideos);
      } catch (err) {
        console.error("Error fetching latest content:", err);
        setError("Failed to load latest content");
      } finally {
        setLoading(false);
      }
    };

    loadLatestContent();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Latest Content</h4>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-20 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Latest Content</h4>
        <p className="text-gray-600 text-sm">
          {error || "No content available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Latest Content</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex space-x-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
            onClick={() => window.open(`/video/${video.id}`, '_blank')}
          >
            <div className="relative w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-gray-400" />
                </div>
              )}
              {video.duration && (
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                  {video.duration}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                {video.title}
              </h5>
              {video.presenter && (
                <p className="text-xs text-gray-600 mt-1">by {video.presenter}</p>
              )}
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
