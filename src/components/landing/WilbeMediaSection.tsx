
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { fetchVideos } from "@/services/videoService";
import { formatDistanceToNow } from "date-fns";
import ContentSearchBar from "./ContentSearchBar";
import { blogPosts } from "@/data/blogPosts";
import BlogReelCard from "./BlogReelCard";
import { useRef } from "react";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function WilbeMediaSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Sort blog posts by date (most recent first)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">WILBE MEDIA</h2>
          
          {/* Search Bar */}
          <div className="mb-12">
            <ContentSearchBar />
          </div>
          
          {/* Loading Videos */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-6">WILBE STORIES: ALL EPISODES</h3>
            <div className="flex space-x-6 mb-8">
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
          
          {/* Loading Blog */}
          <div className="py-12 md:py-16 bg-gray-50 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Latest Insights from Scientists First
              </h3>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">WILBE MEDIA</h2>
          
          {/* Search Bar */}
          <div className="mb-12">
            <ContentSearchBar />
          </div>
          
          {/* Error state for videos */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-6">WILBE STORIES: ALL EPISODES</h3>
            <p className="text-gray-600 mb-8">
              {error || "No videos available at the moment."}
            </p>
          </div>
          
          {/* Blog Reel */}
          <section className="py-12 md:py-16 bg-gray-50 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Latest Insights from Scientists First
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Exploring the intersection of science, entrepreneurship, and innovation
                  </p>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                  <Button asChild variant="default">
                    <Link to="/blog">
                      View All Posts
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                onScroll={checkScrollButtons}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {sortedPosts.map((post) => (
                  <BlogReelCard key={post.id} post={post} />
                ))}
              </div>
              
              <div className="md:hidden mt-6 text-center">
                <Button asChild variant="default">
                  <Link to="/blog">
                    View All Posts
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">WILBE MEDIA</h2>
        
        {/* Search Bar */}
        <div className="mb-12">
          <ContentSearchBar />
        </div>

        {/* Video Stories Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-6">WILBE STORIES: ALL EPISODES</h3>
          
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
            className="w-full select-none touch-pan-x mb-8"
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

        {/* Blog Reel Section */}
        <section className="py-12 md:py-16 bg-gray-50 rounded-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Latest Insights from Scientists First
                </h3>
                <p className="text-gray-600 text-lg">
                  Exploring the intersection of science, entrepreneurship, and innovation
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className="h-10 w-10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className="h-10 w-10"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button asChild variant="default">
                  <Link to="/blog">
                    View All Posts
                  </Link>
                </Button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              onScroll={checkScrollButtons}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {sortedPosts.map((post) => (
                <BlogReelCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="md:hidden mt-6 text-center">
              <Button asChild variant="default">
                <Link to="/blog">
                  View All Posts
                </Link>
              </Button>
            </div>
          </div>
          
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}
