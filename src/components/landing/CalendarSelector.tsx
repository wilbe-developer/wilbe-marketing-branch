
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronDown } from "lucide-react";
import { CalendarEvent, generateCalendarUrls, downloadIcsFile } from "@/utils/calendarUtils";

interface CalendarSelectorProps {
  event: CalendarEvent;
  buttonText?: string;
  className?: string;
}

export default function CalendarSelector({ event, buttonText = "Remind Me", className }: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCalendarClick = (type: 'google' | 'outlook' | 'yahoo' | 'apple') => {
    if (type === 'apple') {
      downloadIcsFile(event);
    } else {
      const urls = generateCalendarUrls(event);
      window.open(urls[type], '_blank');
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 ${className}`}>
          <Calendar className="h-4 w-4 mr-2" />
          {buttonText}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleCalendarClick('google')}
          >
            <div className="w-4 h-4 mr-2 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">G</div>
            Google Calendar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleCalendarClick('outlook')}
          >
            <div className="w-4 h-4 mr-2 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">O</div>
            Outlook Calendar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleCalendarClick('apple')}
          >
            <div className="w-4 h-4 mr-2 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-bold">📅</div>
            Apple Calendar (.ics)
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleCalendarClick('yahoo')}
          >
            <div className="w-4 h-4 mr-2 bg-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">Y</div>
            Yahoo Calendar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
