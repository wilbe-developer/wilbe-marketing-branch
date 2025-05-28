
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Clock } from "lucide-react";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { fetchVideos } from "@/services/videoService";
import { formatDistanceToNow } from "date-fns";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function FoundersStories() {
  const { scrollRef, handleScroll, handleMouseWheel } = useScrollHandler();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) {
    return (
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-6 sm:mb-8">Real world in practice: the leaders</h2>
          <div className="flex space-x-4 sm:space-x-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 sm:w-80 bg-gray-200 animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-6 sm:mb-8">Real world in practice: the leaders</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {error || "No videos available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900">Real world in practice: the leaders</h2>
          <div className="flex space-x-2 sm:space-x-4">
            <button onClick={() => handleScroll(-300)} className="bg-gray-200 hover:bg-gray-300 p-1.5 sm:p-2 rounded">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-180" />
            </button>
            <button onClick={() => handleScroll(300)} className="bg-gray-200 hover:bg-gray-300 p-1.5 sm:p-2 rounded">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex space-x-4 sm:space-x-6" ref={scrollRef} onWheel={handleMouseWheel}>
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-64 sm:w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-lg"
                onClick={() => window.open(`/video/${video.id}`, '_blank')}
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url || "/placeholder.svg"}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  {video.duration && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <Badge className="bg-gray-900 text-white text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.duration}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{video.title}</h4>
                  {video.description && (
                    <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{video.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    {video.presenter && (
                      <span className="text-gray-500">by {video.presenter}</span>
                    )}
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 sm:mt-12">
        <a href="https://wilbe.com/media">
          <Button size="lg" className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-6 sm:px-8 text-sm sm:text-base">
            VIEW ALL MEDIA
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
