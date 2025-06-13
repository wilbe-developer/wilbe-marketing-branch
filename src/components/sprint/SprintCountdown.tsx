
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useSprintCountdown } from "@/hooks/useSprintCountdown";
import { useSprintContext } from "@/hooks/useSprintContext";

export const SprintCountdown = () => {
  const { currentSprintOwnerId, isSharedSprint, canManage } = useSprintContext();
  const { timeLeft, isLoading, startSprint, hasStarted } = useSprintCountdown(currentSprintOwnerId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show start button for own sprints or if user has manage access in shared sprint
  if (!hasStarted && (!isSharedSprint || canManage)) {
    return (
      <Card className="w-full border-green-200 bg-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Play className="h-5 w-5" />
            Ready to Start Your 10-Day BSF?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-700">
            Click below to start your 10-day BSF timer. Once started, you have 10 days to complete BSF and qualify for investment assessment.
          </p>
          <Button 
            onClick={startSprint}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            Start My 10-Day BSF
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Don't show anything if shared sprint hasn't started and user doesn't have manage access
  if (!hasStarted && isSharedSprint && !canManage) {
    return null;
  }

  const getStatusColor = () => {
    if (timeLeft.isExpired) return "text-red-600";
    if (timeLeft.progressPercentage > 80) return "text-orange-600";
    if (timeLeft.progressPercentage > 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getIcon = () => {
    if (timeLeft.isExpired) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (timeLeft.progressPercentage === 100) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-blue-600" />;
  };

  const getTitle = () => {
    if (timeLeft.isExpired) return "BSF Timer Expired";
    return isSharedSprint ? "BSF Timer" : "Your BSF Timer";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {timeLeft.isExpired ? (
          <div className="text-center py-4">
            <p className="text-red-600 font-medium mb-2">Time's up! Your 10-day BSF has ended.</p>
            <p className="text-gray-600">Don't worry - you can still complete your tasks and review your progress.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatusColor()}`}>
                  {timeLeft.days}
                </div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatusColor()}`}>
                  {timeLeft.hours}
                </div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatusColor()}`}>
                  {timeLeft.minutes}
                </div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${getStatusColor()}`}>
                  {timeLeft.seconds}
                </div>
                <div className="text-sm text-gray-500">Seconds</div>
              </div>
            </div>
            
            {timeLeft.progressPercentage > 80 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-orange-800 text-sm font-medium">
                  ⚡ BSF almost complete! Make sure to finish your remaining tasks.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
