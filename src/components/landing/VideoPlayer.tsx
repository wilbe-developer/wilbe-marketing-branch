
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  presenter?: string;
  created_at: string;
}

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100); // Mock duration for demo

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

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
      {/* Video Player */}
      <div className="relative aspect-video group">
        {/* Video thumbnail */}
        <img
          src={video?.thumbnail_url || "/placeholder.svg"}
          alt={video?.title || "Loading..."}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        {/* LIVE badge */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 bg-black/75 backdrop-blur-sm px-2 sm:px-3 py-1">
          <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
          <span className="text-white text-xs font-bold uppercase tracking-wide">LIVE</span>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg p-4 sm:p-6 aspect-square w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center touch-manipulation"
            onClick={() => video && window.open(`/video/${video.id}`, '_blank')}
          >
            <Play className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </div>

        {/* Duration badge */}
        {video?.duration && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/90 text-white text-xs px-2 py-1 rounded-sm font-medium">
            {video.duration}
          </div>
        )}

        {/* YouTube-style Time Bar - Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xs sm:text-sm font-medium min-w-[30px] sm:min-w-[35px] text-center">
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
            <span className="text-xs sm:text-sm font-medium min-w-[30px] sm:min-w-[35px] text-center">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Now Playing Info - Fixed height to prevent shifting */}
      <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
        <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: {video?.title || "Loading..."}</p>
        {/* Reserve space for description even if empty */}
        <div className="min-h-[16px] mt-1">
          {video?.description && (
            <p className="text-gray-300 text-xs line-clamp-1">{video.description}</p>
          )}
        </div>
        {/* Reserve space for presenter even if empty */}
        <div className="min-h-[16px] mt-1">
          {video?.presenter && (
            <p className="text-gray-400 text-xs">by {video.presenter}</p>
          )}
        </div>
      </div>
    </div>
  );
}
