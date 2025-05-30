
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
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
      <section id="videos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">FEATURED VIDEOS</h2>
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
      </section>
    );
  }

  return (
    <section id="videos" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">FEATURED VIDEOS</h2>
          <Button variant="outline" className="hidden md:flex">
            View All Videos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {videos.map((video) => (
              <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-80 md:basis-80">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">
                    <img
                      src={video.thumbnail_url || "/placeholder.svg"}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
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
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gray-900 text-white text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
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

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            View All Videos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
