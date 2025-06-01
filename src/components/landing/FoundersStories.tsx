
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Clock } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
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
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">FROM THE TRENCHES: THE LEADERS</h2>
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
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">FROM THE TRENCHES: THE LEADERS</h2>
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
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">FROM THE TRENCHES: THE LEADERS</h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
            containScroll: "trimSnaps",
            skipSnaps: false,
            duration: 20,
            inViewThreshold: 0.7,
          }}
          className="w-full select-none touch-pan-x"
        >
          <CarouselContent className="-ml-2 md:-ml-4" style={{ touchAction: 'pan-x' }}>
            {videos.map((video) => (
              <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-80 md:basis-80">
                <div
                  className="bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col select-none"
                  onClick={() => window.open(`/video/${video.id}`, '_blank')}
                  draggable={false}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail_url || "/placeholder.svg"}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      draggable={false}
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
                  <div className="p-4 flex-1 flex flex-col h-32">
                    <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 flex-shrink-0">{video.title}</h4>
                    {video.description && (
                      <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{video.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto flex-shrink-0">
                      {video.presenter && (
                        <span className="text-gray-500 text-xs truncate mr-2">{video.presenter}</span>
                      )}
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}
