
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Users } from "lucide-react";

export default function WilbeStreamPlayer() {
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

  return (
    <div className="space-y-4">
      {/* Video Player Placeholder */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-full p-6">
            <Play className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm rounded p-3">
            <p className="text-white text-sm font-medium">🔴 LIVE: Wilbe Science Weekly Roundup</p>
            <p className="text-gray-300 text-xs">Breaking down the latest in scientist entrepreneurship</p>
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

      {/* Stream Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-500">847</div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Live Viewers</p>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">2.1K</div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Weekly Audience</p>
        </div>
      </div>
    </div>
  );
}
