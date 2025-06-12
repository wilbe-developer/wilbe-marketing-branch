
import { Calendar, Clock } from "lucide-react";
import CalendarSelector from "./CalendarSelector";
import LiveEventCountdown from "./LiveEventCountdown";
import { CalendarEvent } from "@/utils/calendarUtils";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface NextLiveEventProps {
  timeLeft: CountdownTime;
}

export default function NextLiveEvent({ timeLeft }: NextLiveEventProps) {
  // Next live event - Updated with new date
  const nextEvent = {
    title: "Ep 6: From PhD War Models to an AI x Defense Exit",
    speaker: "With Sean Gourley",
    date: "2025-06-12T16:00:00Z", // 12:00 ET = 16:00 UTC
    description: "Join leading scientists discussing the latest breakthroughs in AI-powered drug discovery"
  };

  // Calendar event data for the next live event
  const nextEventCalendarData: CalendarEvent = {
    title: "Ep 6: From PhD War Models to an AI x Defense Exit",
    description: "Join Sean Gourley discussing breakthrough insights in AI-powered defense applications and his entrepreneurial journey from PhD research to successful exit. Learn from leading scientists about the latest developments in the intersection of AI and defense technology.",
    startDate: new Date('2025-06-12T16:00:00Z'), // 12:00 PM ET = 16:00 UTC
    endDate: new Date('2025-06-12T17:00:00Z'), // 1 hour duration
    location: "Wilbe Live Stream - https://wilbe.com"
  };

  return (
    <div className="bg-white rounded-lg p-4 text-gray-900 w-full border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Next Live Event</span>
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">{nextEvent.title}</h3>
      <p className="text-sm text-gray-600 mb-3 sm:mb-4">
        With{" "}
        <a 
          href="https://x.com/sgourley" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors min-h-[44px] inline-flex items-center"
        >
          Sean Gourley
        </a>
      </p>
      
      {/* Event Date & Time - Updated to June 12, 2025 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>June 12, 2025</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>12:00 PM ET</span>
        </div>
      </div>
      
      <LiveEventCountdown timeLeft={timeLeft} />
      
      <CalendarSelector event={nextEventCalendarData} />
    </div>
  );
}
