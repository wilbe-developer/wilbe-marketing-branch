
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
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">THE LEADERS</h2>
          <div className="flex space-x-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-gray-200 animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
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
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">THE LEADERS</h2>
          <p className="text-gray-600">
            {error || "No videos available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">THE LEADERS</h2>
          <div className="flex space-x-4">
            <button onClick={() => handleScroll(-300)} className="bg-gray-200 hover:bg-gray-300 p-2">
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            <button onClick={() => handleScroll(300)} className="bg-gray-200 hover:bg-gray-300 p-2">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex space-x-6" ref={scrollRef} onWheel={handleMouseWheel}>
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => window.open(`/video/${video.id}`, '_blank')}
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
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
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gray-900 text-white text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.duration}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{video.title}</h4>
                  {video.description && (
                    <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">{video.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {video.presenter && (
                      <span className="text-gray-500 text-xs">by {video.presenter}</span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <a href="https://wilbe.com/media">
          <Button size="lg" className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-8">
            VIEW ALL MEDIA
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
