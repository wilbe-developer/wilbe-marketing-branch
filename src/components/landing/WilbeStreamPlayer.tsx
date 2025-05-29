import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Users } from "lucide-react";
import { fetchVideos } from "@/services/videoService";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

export default function WilbeStreamPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 17,
    hours: 6,
    minutes: 33,
    seconds: 23
  });

  // Next live event
  const nextEvent = {
    title: "AI in Drug Discovery Panel",
    speaker: "Dr. Sarah Chen, Prof. Michael Rodriguez",
    date: "2025-06-15T18:00:00Z",
    description: "Join leading scientists discussing the latest breakthroughs in AI-powered drug discovery"
  }

  // Load videos from the same source as FoundersStories
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
        // Fallback to empty array if fetch fails
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Cycle through videos every 20 seconds
  useEffect(() => {
    if (videos.length === 0) return;
    
    const videoTimer = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length);
    }, 20000); // Changed to 20 seconds

    return () => clearInterval(videoTimer);
  }, [videos.length]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show loading state or fallback if no videos
  if (loading || videos.length === 0) {
    return (
      <div className="space-y-4">
        {/* Video Player - Loading/Fallback */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-white text-center">
              {loading ? "Loading videos..." : "No videos available"}
            </div>
          </div>
        </div>

        {/* Next Live Event - Compact Design */}
        <div className="bg-gray-800 rounded-lg p-4 text-white max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Next Live Event</span>
          </div>
          
          <h3 className="text-base font-bold text-white mb-1">{nextEvent.title}</h3>
          <p className="text-sm text-gray-300 mb-4">{nextEvent.speaker}</p>
          
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.days}</div>
              <div className="text-xs text-gray-400 mt-1">D</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.hours}</div>
              <div className="text-xs text-gray-400 mt-1">H</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-400 mt-1">M</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-400 mt-1">S</div>
            </div>
          </div>
          
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-sm py-2">
            Remind Me
          </Button>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {/* Video thumbnail */}
        <img
          src={currentVideo.thumbnail_url || "/placeholder.svg"}
          alt={currentVideo.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-full p-6"
            onClick={() => window.open(`/video/${currentVideo.id}`, '_blank')}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
        
        {/* Video info overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm rounded p-3">
            <p className="text-white text-sm font-medium">🔴 NOW PLAYING: {currentVideo.title}</p>
            {currentVideo.description && (
              <p className="text-gray-300 text-xs">{currentVideo.description}</p>
            )}
            {currentVideo.presenter && (
              <p className="text-gray-400 text-xs mt-1">by {currentVideo.presenter}</p>
            )}
          </div>
        </div>

        {/* Duration badge */}
        {currentVideo.duration && (
          <div className="absolute top-4 right-4 bg-black/75 text-white text-xs px-2 py-1 rounded">
            {currentVideo.duration}
          </div>
        )}
      </div>

      {/* Next Live Event - Compact Design */}
      <div className="bg-gray-800 rounded-lg p-4 text-white max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Next Live Event</span>
        </div>
        
        <h3 className="text-base font-bold text-white mb-1">{nextEvent.title}</h3>
        <p className="text-sm text-gray-300 mb-4">{nextEvent.speaker}</p>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.days}</div>
            <div className="text-xs text-gray-400 mt-1">D</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.hours}</div>
            <div className="text-xs text-gray-400 mt-1">H</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-400 mt-1">M</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-lg font-bold py-1 px-2 rounded">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-400 mt-1">S</div>
          </div>
        </div>
        
        <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-sm py-2">
          Remind Me
        </Button>
      </div>
    </div>
  );
}
