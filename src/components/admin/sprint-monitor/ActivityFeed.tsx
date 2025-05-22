
import React from 'react';
import { ActivityEvent } from '@/hooks/admin/useSprintMonitor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Clock, Upload, Edit } from 'lucide-react';

interface ActivityFeedProps {
  activityFeed: ActivityEvent[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activityFeed }) => {
  if (!activityFeed || activityFeed.length === 0) {
    return <div className="text-center py-8 text-gray-500">No activity recorded yet</div>;
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activityFeed.map((event) => (
          <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <div className="flex-shrink-0">
              {event.eventType === 'signup' && (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
              )}
              {event.eventType === 'task_completed' && (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              )}
              {event.eventType === 'task_started' && (
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              )}
              {event.eventType === 'file_uploaded' && (
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-purple-600" />
                </div>
              )}
              {event.eventType === 'profile_updated' && (
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Edit className="h-5 w-5 text-orange-600" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium">{event.userName}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {event.eventType === 'signup' && 'Signed up for the sprint'}
                {event.eventType === 'task_completed' && `Completed task: ${event.taskName}`}
                {event.eventType === 'task_started' && `Started task: ${event.taskName}`}
                {event.eventType === 'file_uploaded' && 'Uploaded a file'}
                {event.eventType === 'profile_updated' && 'Updated their profile'}
              </p>
              
              {event.details && (
                <p className="text-xs text-gray-500 mt-1">{event.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ActivityFeed;
