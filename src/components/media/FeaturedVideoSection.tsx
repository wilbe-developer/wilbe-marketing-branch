
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ArrowRight } from "lucide-react"
import { fetchVideos } from "@/services/videoService"
import { formatDistanceToNow } from "date-fns"

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function FeaturedVideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();
        const sortedVideos = videosData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        setVideos(sortedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-black">VIDEO</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200">
                <div className="aspect-video bg-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-12 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-black">VIDEO</h2>
          <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 text-sm font-medium">
            MORE VIDEOS
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <article key={video.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={video.thumbnail_url || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-full p-3">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/80 text-white text-xs">
                      {video.duration}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {video.presenter && (
                    <span className="font-medium">{video.presenter}</span>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(video.created_at), { addSuffix: true }).toUpperCase()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
