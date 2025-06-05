
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, FileText, MessageSquare, HelpCircle } from "lucide-react";
import { UserTaskProgress } from "@/types/sprint";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { WorkloadBadge } from "./WorkloadBadge";

interface MySprintsListProps {
  tasks: UserTaskProgress[];
}

export const MySprintsList = ({ tasks }: MySprintsListProps) => {
  const isMobile = useIsMobile();
  
  const getTaskIcon = (task: UserTaskProgress) => {
    if (task.progress?.completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (task.upload_required) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    if (task.question) {
      return <HelpCircle className="h-5 w-5 text-purple-600" />;
    }
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={`transition-all hover:shadow-md ${
            task.progress?.completed 
              ? 'bg-green-50 border-green-200' 
              : 'hover:border-brand-pink'
          }`}
        >
          <CardHeader className={isMobile ? "pb-3" : "pb-4"}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getTaskIcon(task)}
                <div className="flex-1 min-w-0">
                  <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} leading-tight`}>
                    {task.title}
                  </CardTitle>
                  {task.description && (
                    <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  {/* Workload badge on mobile goes under description */}
                  {isMobile && task.workload && (
                    <div className="mt-2">
                      <WorkloadBadge workload={task.workload} showTime={true} size="sm" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Workload badge on desktop goes to the right */}
              {!isMobile && task.workload && (
                <div className="flex-shrink-0">
                  <WorkloadBadge workload={task.workload} showTime={true} />
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className={isMobile ? "pt-0" : ""}>
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'}`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                {task.progress?.completed ? (
                  <span className="text-green-600 font-medium">Completed</span>
                ) : (
                  <span className="text-gray-500">Pending</span>
                )}
                {task.category && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 capitalize">{task.category}</span>
                  </>
                )}
              </div>
              
              <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                <Button 
                  asChild 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className={isMobile ? 'flex-1' : ''}
                >
                  <Link to={`/community?challenge=${task.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Discuss
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size={isMobile ? "sm" : "default"}
                  className={isMobile ? 'flex-1' : ''}
                >
                  <Link to={`/sprint/task/${task.id}`}>
                    {task.progress?.completed ? 'Review' : 'Start Task'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
