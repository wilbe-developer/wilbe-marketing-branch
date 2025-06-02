
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import BlogReelCard from "./BlogReelCard";

export default function BlogReel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Sort posts by date (most recent first)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest Insights from Scientists First
            </h2>
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
        
        {/* Mobile View All Button */}
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
  );
}
