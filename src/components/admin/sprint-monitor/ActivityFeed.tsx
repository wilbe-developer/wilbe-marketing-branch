
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, FileText, User, CheckCircle, LogIn } from 'lucide-react';

interface ActivityFeedProps {
  activityFeed: any[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activityFeed }) => {
  if (!activityFeed || activityFeed.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No activity data available
      </div>
    );
  }

  // Helper function to get the icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'signup':
        return <LogIn className="h-4 w-4 text-blue-500" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'file_uploaded':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'profile_updated':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      {activityFeed.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(activity.userName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <span className="font-medium text-sm">{activity.userName}</span>
              <span className="ml-2 text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-700">
              {getEventIcon(activity.eventType)}
              <span className="ml-2">{activity.details}</span>
            </div>
            
            {activity.taskName && (
              <div className="text-xs text-gray-500">
                Task: {activity.taskName}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
