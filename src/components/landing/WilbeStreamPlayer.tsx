
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Users } from "lucide-react";

export default function WilbeStreamPlayer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Next live event
  const nextEvent = {
    title: "From PhD War Models to an AI x Defense Exit",
    speaker: "with Sean Gourley",
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
    <div className="space-y-6">
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

      {/* Next Live Event */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Next Live Event</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{nextEvent.title}</h3>
        <p className="text-green-600 font-medium mb-4">{nextEvent.speaker}</p>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeLeft.days}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeLeft.hours}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Min</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Sec</div>
          </div>
        </div>
        
        <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold uppercase tracking-wide">
          Set Reminder
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
