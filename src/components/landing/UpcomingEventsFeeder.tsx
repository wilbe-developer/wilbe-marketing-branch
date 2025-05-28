
import { Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  event_type: string;
  url?: string;
}

const upcomingEvents: Event[] = [
  {
    id: "event-1",
    title: "Biotech Startup Bootcamp",
    description: "Learn the fundamentals of starting a biotech company from lab to market.",
    date: "2025-06-15",
    time: "2:00 PM EST",
    location: "Boston, MA",
    event_type: "Workshop",
    url: "/events"
  },
  {
    id: "event-2", 
    title: "AI in Drug Discovery Panel",
    description: "Industry experts discuss the future of AI-powered pharmaceutical research.",
    date: "2025-06-22",
    time: "6:00 PM EST",
    location: "San Francisco, CA",
    event_type: "Panel",
    url: "/events"
  },
  {
    id: "event-3",
    title: "Climate Tech Networking Mixer",
    description: "Connect with fellow climate scientists and entrepreneurs in your area.",
    date: "2025-06-28",
    time: "7:00 PM EST",
    location: "New York, NY",
    event_type: "Networking",
    url: "/events"
  },
  {
    id: "event-4",
    title: "Funding Your Deep Tech Startup",
    description: "VCs and angel investors share insights on securing funding for science-based ventures.",
    date: "2025-07-05",
    time: "1:00 PM EST",
    location: "Virtual",
    event_type: "Seminar",
    url: "/events"
  },
  {
    id: "event-5",
    title: "Lab to Market: Success Stories",
    description: "Hear from successful scientist founders about their entrepreneurial journey.",
    date: "2025-07-12",
    time: "4:00 PM EST",
    location: "Austin, TX",
    event_type: "Talk",
    url: "/events"
  }
];

export default function UpcomingEventsFeeder() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Community Events</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex space-x-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
            onClick={() => window.open(event.url || '/events', '_blank')}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-green-600">
                {formatDate(event.date).split(' ')[0]}
              </div>
              <div className="text-lg font-bold text-green-700">
                {formatDate(event.date).split(' ')[1]}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                {event.title}
              </h5>
              {event.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                {event.time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                )}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  {event.event_type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
