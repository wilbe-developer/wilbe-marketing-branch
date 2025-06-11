
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/lib/constants";

interface SearchResult {
  id: string;
  title: string;
  type: 'video' | 'page';
  description: string;
  url: string;
}

export const useContentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);

  // Static pages that can be searched
  const staticPages: SearchResult[] = [
    {
      id: "bsf-page",
      title: "Breakthrough to Scientist Founder",
      type: "page",
      description: "Our flagship program for scientist entrepreneurs - join the waitlist",
      url: "/waitlist"
    }
  ];

  // Fetch videos on hook initialization
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, description, youtube_id")
        .eq("status", "published");
      
      if (error) {
        console.error("Error fetching videos:", error);
        return;
      }
      
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay for better UX
    setTimeout(() => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search videos
      const videoResults: SearchResult[] = videos
        .filter(video => 
          video.title.toLowerCase().includes(searchLower) ||
          (video.description && video.description.toLowerCase().includes(searchLower))
        )
        .map(video => ({
          id: video.id,
          title: video.title,
          type: 'video' as const,
          description: video.description || "Video content",
          url: `${PATHS.VIDEO}/${video.id}`
        }));

      // Search static pages
      const pageResults = staticPages.filter(page =>
        page.title.toLowerCase().includes(searchLower) ||
        page.description.toLowerCase().includes(searchLower)
      );

      setResults([...videoResults, ...pageResults]);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return {
    query,
    results,
    isSearching,
    handleSearch,
    clearSearch
  };
};
