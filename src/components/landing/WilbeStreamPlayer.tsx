
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100); // Mock duration for demo
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

  // Mock time progression for demo
  useEffect(() => {
    const timeTimer = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        return newTime >= duration ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(timeTimer);
  }, [duration]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle scrubber change
  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  // Show loading state or fallback if no videos
  if (loading || videos.length === 0) {
    return (
      <div className="space-y-4">
        {/* Video Player Container - Loading/Fallback */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                {loading ? "Loading videos..." : "No videos available"}
              </div>
            </div>
          </div>
          
          {/* Now Playing Info - Inside the container */}
          <div className="bg-black/90 p-3">
            <p className="text-white text-sm font-medium">NOW PLAYING: Loading...</p>
          </div>
        </div>

        {/* Next Live Event - Smaller Size */}
        <div className="bg-gray-800 rounded-lg p-3 text-white max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Next Live Event</span>
          </div>
          
          <h3 className="text-sm font-bold text-white mb-1">{nextEvent.title}</h3>
          <p className="text-xs text-gray-300 mb-3">{nextEvent.speaker}</p>
          
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            <div className="text-center">
              <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.days}</div>
              <div className="text-xs text-gray-400 mt-1">D</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.hours}</div>
              <div className="text-xs text-gray-400 mt-1">H</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-400 mt-1">M</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-400 mt-1">S</div>
            </div>
          </div>
          
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-xs py-1">
            Remind Me
          </Button>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="space-y-4">
      {/* Video Player Container - Framed with NOW PLAYING */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {/* Video Player */}
        <div className="relative aspect-video group">
          {/* Video thumbnail */}
          <img
            src={currentVideo?.thumbnail_url || "/placeholder.svg"}
            alt={currentVideo?.title || "Loading..."}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          
          {/* LIVE badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/75 backdrop-blur-sm px-3 py-1">
            <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
            <span className="text-white text-xs font-bold uppercase tracking-wide">LIVE</span>
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-8 py-6"
              onClick={() => currentVideo && window.open(`/video/${currentVideo.id}`, '_blank')}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>

          {/* Duration badge */}
          {currentVideo?.duration && (
            <div className="absolute top-4 right-4 bg-black/90 text-white text-xs px-2 py-1 rounded-sm font-medium">
              {currentVideo.duration}
            </div>
          )}

          {/* YouTube-style Time Bar - Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm font-medium min-w-[35px] text-center">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 flex items-center group/slider">
                <div className="relative w-full h-1 bg-white/30 hover:h-1.5 transition-all duration-150 cursor-pointer rounded-sm overflow-hidden">
                  {/* Progress bar background */}
                  <div className="absolute inset-0 bg-white/30"></div>
                  {/* Progress bar fill */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-150"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                  {/* Slider thumb - only visible on hover */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-150 shadow-lg"
                    style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-6px' }}
                  ></div>
                  {/* Invisible input for interaction */}
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-sm font-medium min-w-[35px] text-center">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Now Playing Info - Inside the same container */}
        <div className="bg-black/90 p-3">
          <p className="text-white text-sm font-medium">NOW PLAYING: {currentVideo?.title || "Loading..."}</p>
          {currentVideo?.description && (
            <p className="text-gray-300 text-xs">{currentVideo.description}</p>
          )}
          {currentVideo?.presenter && (
            <p className="text-gray-400 text-xs mt-1">by {currentVideo.presenter}</p>
          )}
        </div>
      </div>

      {/* Next Live Event - Smaller Design */}
      <div className="bg-gray-800 rounded-lg p-3 text-white max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Next Live Event</span>
        </div>
        
        <h3 className="text-sm font-bold text-white mb-1">{nextEvent.title}</h3>
        <p className="text-xs text-gray-300 mb-3">{nextEvent.speaker}</p>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          <div className="text-center">
            <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.days}</div>
            <div className="text-xs text-gray-400 mt-1">D</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.hours}</div>
            <div className="text-xs text-gray-400 mt-1">H</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-400 mt-1">M</div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-black text-sm font-bold py-1 px-1 rounded">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-400 mt-1">S</div>
          </div>
        </div>
        
        <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-xs py-1">
          Remind Me
        </Button>
      </div>
    </div>
  );
}
