
import React from 'react';
import { Activity, CheckCircle, Upload, UserPlus, Clock, FileText, Edit, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: 'signup' | 'task_started' | 'task_completed' | 'file_uploaded' | 'profile_updated';
  taskId?: string;
  taskName?: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  activityFeed: ActivityEvent[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activityFeed }) => {
  if (!activityFeed || activityFeed.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No activity has been recorded yet
      </div>
    );
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'signup':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'task_completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'file_uploaded':
        return <Upload className="h-5 w-5 text-amber-500" />;
      case 'profile_updated':
        return <Edit className="h-5 w-5 text-purple-500" />;
      case 'task_started':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'signup':
        return <Badge variant="success">Signup</Badge>;
      case 'task_completed':
        return <Badge variant="info">Task Completed</Badge>;
      case 'file_uploaded':
        return <Badge variant="warning">File Upload</Badge>;
      case 'profile_updated':
        return <Badge variant="secondary">Profile Update</Badge>;
      case 'task_started':
        return <Badge variant="outline">Task Started</Badge>;
      default:
        return <Badge variant="default">Activity</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group activities by date
  const groupedActivities: Record<string, ActivityEvent[]> = {};
  
  activityFeed.forEach(event => {
    const date = new Date(event.timestamp).toLocaleDateString();
    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    groupedActivities[date].push(event);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, events]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="pt-1">
                {getEventIcon(event.eventType)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-medium">{event.userName}</span>
                    <span className="text-gray-500 mx-2">•</span>
                    {getEventBadge(event.eventType)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatTime(event.timestamp)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  {event.eventType === 'task_completed' && event.taskName && (
                    <>Completed task: <span className="font-medium">{event.taskName}</span></>
                  )}
                  {event.eventType === 'file_uploaded' && event.taskName && (
                    <>Uploaded a file for: <span className="font-medium">{event.taskName}</span></>
                  )}
                  {event.eventType === 'signup' && (
                    <>User signed up for sprint</>
                  )}
                  {event.eventType === 'profile_updated' && (
                    <>Updated their sprint profile</>
                  )}
                  {event.eventType === 'task_started' && event.taskName && (
                    <>Started task: <span className="font-medium">{event.taskName}</span></>
                  )}
                  {event.details && (
                    <div className="text-xs text-gray-500 mt-1">{event.details}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
