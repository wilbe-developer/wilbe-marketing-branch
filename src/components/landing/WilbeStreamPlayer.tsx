
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Calendar, Clock, Users } from "lucide-react";
import { fetchVideos } from "@/services/videoService";
import CalendarSelector from "./CalendarSelector";
import { CalendarEvent } from "@/utils/calendarUtils";

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
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Next live event - Updated with new content
  const nextEvent = {
    title: "Ep 6: From PhD War Models to an AI x Defense Exit",
    speaker: "With Sean Gourley",
    date: "2025-06-10T16:00:00Z", // 12:00 ET = 16:00 UTC
    description: "Join leading scientists discussing the latest breakthroughs in AI-powered drug discovery"
  }

  // Calendar event data for the next live event
  const nextEventCalendarData: CalendarEvent = {
    title: "Ep 6: From PhD War Models to an AI x Defense Exit",
    description: "Join Sean Gourley discussing breakthrough insights in AI-powered defense applications and his entrepreneurial journey from PhD research to successful exit. Learn from leading scientists about the latest developments in the intersection of AI and defense technology.",
    startDate: new Date('2025-06-10T16:00:00Z'), // 12:00 PM ET = 16:00 UTC
    endDate: new Date('2025-06-10T17:00:00Z'), // 1 hour duration
    location: "Wilbe Live Stream - https://wilbe.com"
  };

  // Calculate countdown to event date
  const calculateTimeLeft = () => {
    const eventDate = new Date('2025-06-10T16:00:00Z').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

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

  // Dynamic countdown timer
  useEffect(() => {
    // Initialize the countdown
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
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
      <div className="w-full max-w-md">
        <div className="grid grid-rows-[auto_auto] gap-4 h-full">
          {/* Video Player Container - Loading/Fallback */}
          <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
            <div className="relative aspect-video">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  {loading ? "Loading videos..." : "No videos available"}
                </div>
              </div>
            </div>
            
            {/* Now Playing Info - Fixed height */}
            <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
              <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: Loading...</p>
              <div className="h-4"></div>
              <div className="h-4"></div>
            </div>
          </div>

          {/* Next Live Event - Fixed position */}
          <div className="bg-white rounded-lg p-4 text-gray-900 w-full border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Next Live Event</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{nextEvent.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{nextEvent.speaker}</p>
            
            {/* Event Date & Time - Updated */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>June 10, 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>12:00 PM ET</span>
              </div>
            </div>
            
            {/* Countdown Timer - Redesigned with less green */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.days}</div>
                <div className="text-xs text-gray-500 mt-1">Days</div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500 mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500 mt-1">Min</div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-500 mt-1">Sec</div>
              </div>
            </div>
            
            <CalendarSelector event={nextEventCalendarData} />
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="w-full max-w-md">
      <div className="grid grid-rows-[auto_auto] gap-4 h-full">
        {/* Video Player Container - Fixed Width */}
        <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
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
                className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-6 py-4 aspect-square w-20 h-20 flex items-center justify-center"
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

          {/* Now Playing Info - Fixed height to prevent shifting */}
          <div className="bg-gray-800 p-3 min-h-[80px] flex flex-col justify-center">
            <p className="text-white text-sm font-medium line-clamp-2">NOW PLAYING: {currentVideo?.title || "Loading..."}</p>
            {/* Reserve space for description even if empty */}
            <div className="min-h-[16px] mt-1">
              {currentVideo?.description && (
                <p className="text-gray-300 text-xs line-clamp-1">{currentVideo.description}</p>
              )}
            </div>
            {/* Reserve space for presenter even if empty */}
            <div className="min-h-[16px] mt-1">
              {currentVideo?.presenter && (
                <p className="text-gray-400 text-xs">by {currentVideo.presenter}</p>
              )}
            </div>
          </div>
        </div>

        {/* Next Live Event - Fixed position and redesigned */}
        <div className="bg-white rounded-lg p-4 text-gray-900 w-full border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Next Live Event</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">{nextEvent.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{nextEvent.speaker}</p>
          
          {/* Event Date & Time - Updated */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>June 10, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>12:00 PM ET</span>
            </div>
          </div>
          
          {/* Countdown Timer - Redesigned with less green */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.days}</div>
              <div className="text-xs text-gray-500 mt-1">Days</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.hours}</div>
              <div className="text-xs text-gray-500 mt-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-500 mt-1">Min</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-500 mt-1">Sec</div>
            </div>
          </div>
          
          <CalendarSelector event={nextEventCalendarData} />
        </div>
      </div>
    </div>
  );

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
}
