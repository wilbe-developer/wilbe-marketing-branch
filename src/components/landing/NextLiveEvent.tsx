
import { Calendar, Clock } from "lucide-react";
import CalendarSelector from "./CalendarSelector";
import LiveEventCountdown from "./LiveEventCountdown";
import { CalendarEvent } from "@/utils/calendarUtils";
import { useLiveEvents } from "@/hooks/useLiveEvents";

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
  const { nextEvent, loading } = useLiveEvents();

  // If no event or still loading, don't render anything
  if (loading || !nextEvent) {
    return null;
  }

  const eventDate = new Date(nextEvent.event_date);
  const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  // Calendar event data for the next live event
  const nextEventCalendarData: CalendarEvent = {
    title: nextEvent.title,
    description: nextEvent.description || `Join ${nextEvent.speaker} for an engaging discussion about breakthrough insights and innovations.`,
    startDate: eventDate,
    endDate: endDate,
    location: nextEvent.location || "Wilbe Live Stream - https://wilbe.com"
  };

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 text-gray-900 w-full border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Next Live Event</span>
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">{nextEvent.title}</h3>
      
      {nextEvent.speaker && (
        <p className="text-sm text-gray-600 mb-3 sm:mb-4">
          With{" "}
          {nextEvent.speaker_link ? (
            <a 
              href={nextEvent.speaker_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors min-h-[44px] inline-flex items-center"
            >
              {nextEvent.speaker}
            </a>
          ) : (
            <span className="text-blue-600">{nextEvent.speaker}</span>
          )}
        </p>
      )}
      
      {/* Event Date & Time */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatEventDate(eventDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatEventTime(eventDate)}</span>
        </div>
      </div>
      
      <LiveEventCountdown timeLeft={timeLeft} />
      
      <CalendarSelector event={nextEventCalendarData} />
    </div>
  );
}
