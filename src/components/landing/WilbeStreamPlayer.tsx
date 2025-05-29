
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Users } from "lucide-react";

// Featured videos data (same as in LatestContentFeed)
const featuredVideos = [
  {
    id: "26d42e3b-7484-49a4-88bc-a6bdf2f509a8",
    title: "Two Ways of Doing Ventures",
    description: "There are two distinct ways of doing ventures, and we think you'll like one most.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//2ways.webp",
    duration: "9:06",
    presenter: null,
    created_at: "2024-05-15T15:00:39+00:00"
  },
  {
    id: "featured-comparing-startups",
    title: "Comparing Startups and Large Companies",
    description: "Understanding the key differences between startup and corporate environments.",
    thumbnail_url: "/placeholder.svg",
    duration: "8:30",
    presenter: "Ale",
    created_at: "2024-03-01T12:00:00+00:00"
  },
  {
    id: "featured-one-liner",
    title: "Writing your one-liner",
    description: "Craft a compelling one-line description of your business that captures attention.",
    thumbnail_url: "/placeholder.svg",
    duration: "6:45",
    presenter: "Ale",
    created_at: "2024-03-02T12:00:00+00:00"
  },
  {
    id: "featured-customer-identification",
    title: "Buyers, Users and Titles: Identifying your customer",
    description: "Learn to distinguish between different customer types and how to reach them.",
    thumbnail_url: "/placeholder.svg",
    duration: "12:20",
    presenter: "Josh McKenty",
    created_at: "2024-03-03T12:00:00+00:00"
  },
  {
    id: "6b8d3ca3-9159-4f8a-acf9-3ecae38e2caf",
    title: "About the TTO",
    description: "Before you can start your company you will likely need to negotiate a licensing deal with your institution.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//_Wilbe%20BSF10%202023%20%20Kickoff%20(9).webp",
    duration: "6:25",
    presenter: "Lita Nelsen",
    created_at: "2024-03-06T12:00:00+00:00"
  },
  {
    id: "1d20ab92-9c3b-4635-921c-c874ccc5304f",
    title: "The Basics of Shares",
    description: "Before we talk about getting the team together, you need to know some basics around how shares work.",
    thumbnail_url: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/thumbnails//basicsofshares.webp",
    duration: "6:23",
    presenter: "Ale",
    created_at: "2024-03-04T12:11:03+00:00"
  }
];

export default function WilbeStreamPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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

  // Cycle through videos every 5 seconds
  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % featuredVideos.length);
    }, 5000);

    return () => clearInterval(videoTimer);
  }, []);

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

  const currentVideo = featuredVideos[currentVideoIndex];

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {/* Video thumbnail */}
        <img
          src={currentVideo.thumbnail_url}
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
            <p className="text-gray-300 text-xs">{currentVideo.description}</p>
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
