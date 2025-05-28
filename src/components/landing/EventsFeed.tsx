
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'networking' | 'pitch' | 'seminar';
  attendees: number;
  maxAttendees: number;
}

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Pitch Deck Workshop',
    date: 'Dec 15',
    time: '2:00 PM EST',
    location: 'MIT Innovation Lab',
    type: 'workshop',
    attendees: 12,
    maxAttendees: 20
  },
  {
    id: '2',
    title: 'Biotech Networking Mixer',
    date: 'Dec 18',
    time: '6:00 PM EST',
    location: 'Harvard Innovation Lab',
    type: 'networking',
    attendees: 35,
    maxAttendees: 50
  },
  {
    id: '3',
    title: 'Investor Panel Discussion',
    date: 'Dec 22',
    time: '1:00 PM EST',
    location: 'Virtual Event',
    type: 'seminar',
    attendees: 89,
    maxAttendees: 100
  },
  {
    id: '4',
    title: 'Demo Day Practice',
    date: 'Jan 5',
    time: '10:00 AM EST',
    location: 'Kendall Square',
    type: 'pitch',
    attendees: 8,
    maxAttendees: 15
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'workshop':
      return 'bg-blue-100 text-blue-700';
    case 'networking':
      return 'bg-green-100 text-green-700';
    case 'pitch':
      return 'bg-purple-100 text-purple-700';
    case 'seminar':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function EventsFeed() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
        Upcoming Events
      </h3>
      
      <div className="space-y-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {event.title}
                  </h4>
                  <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {event.date}
                    <Clock className="h-3 w-3 ml-3 mr-1" />
                    {event.time}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
