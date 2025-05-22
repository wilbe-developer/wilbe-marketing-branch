
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProgress {
  userId: string;
  userName: string;
  email: string;
  tasksCompleted: number;
  totalTasks: number;
  lastActivity: string;
  progressPercentage: number;
  taskProgress: {
    taskId: string;
    taskName: string;
    status: 'not_started' | 'in_progress' | 'completed';
    completedAt: string | null;
    timeSpent: number | null;
  }[];
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: 'signup' | 'task_started' | 'task_completed' | 'file_uploaded' | 'profile_updated';
  taskId?: string;
  taskName?: string;
  timestamp: string;
  details?: string;
}

export interface TaskPerformanceData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTimeToComplete: number;
  completedToday: number;
  taskBreakdown: {
    taskId: string;
    taskName: string;
    totalAttempts: number;
    completions: number;
    averageTime: number;
    abandonmentRate: number;
  }[];
}

export const useSprintMonitor = () => {
  const [userProgressData, setUserProgressData] = useState<UserProgress[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [taskPerformance, setTaskPerformance] = useState<TaskPerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all data
  const fetchAllMonitorData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch sprint profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('sprint_profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Fetch task progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_sprint_progress')
        .select('*');
        
      if (progressError) throw progressError;
      
      // Fetch all tasks to know the total
      const { data: tasksData, error: tasksError } = await supabase
        .from('sprint_tasks')
        .select('*');
        
      if (tasksError) throw tasksError;
      
      // Create a task title mapping
      const taskTitleMap = new Map<string, string>();
      if (tasksData) {
        tasksData.forEach(task => {
          taskTitleMap.set(task.id, task.title);
        });
      }
      
      // Process user progress data
      const processedUserProgress: UserProgress[] = [];
      if (profilesData) {
        for (const profile of profilesData) {
          const userProgress = progressData?.filter(p => p.user_id === profile.user_id) || [];
          
          const userTasks = userProgress.map(p => ({
            taskId: p.task_id,
            taskName: taskTitleMap.get(p.task_id) || 'Unknown Task',
            status: p.completed ? 'completed' as const : 'in_progress' as const,
            completedAt: p.completed_at,
            timeSpent: p.completed_at ? 
              new Date(p.completed_at).getTime() - new Date(p.created_at).getTime() : null
          }));
          
          const lastActivityTime = userProgress.length > 0 ? 
            Math.max(...userProgress.map(p => {
              const updatedAt = p.completed_at || p.created_at;
              return new Date(updatedAt).getTime();
            })) : 
            new Date(profile.created_at).getTime();
            
          processedUserProgress.push({
            userId: profile.user_id,
            userName: profile.name || 'Unknown User',
            email: profile.email || 'No Email',
            tasksCompleted: userProgress.filter(p => p.completed).length,
            totalTasks: tasksData?.length || 0,
            lastActivity: new Date(lastActivityTime).toISOString(),
            progressPercentage: tasksData?.length ? 
              (userProgress.filter(p => p.completed).length / tasksData.length) * 100 : 0,
            taskProgress: userTasks
          });
        }
      }
      
      // Sort by last activity
      processedUserProgress.sort((a, b) => 
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );
      
      setUserProgressData(processedUserProgress);
      
      // Generate mock activity feed (in a real app, you would have a dedicated activity log table)
      const mockActivityFeed: ActivityEvent[] = [];
      if (profilesData && progressData) {
        // Add signup events
        profilesData.forEach(profile => {
          mockActivityFeed.push({
            id: `signup-${profile.user_id}`,
            userId: profile.user_id,
            userName: profile.name || 'Unknown User',
            eventType: 'signup',
            timestamp: profile.created_at,
            details: 'User signed up for sprint'
          });
        });
        
        // Add task completion events
        progressData.filter(p => p.completed).forEach(progress => {
          const profile = profilesData.find(p => p.user_id === progress.user_id);
          const taskName = taskTitleMap.get(progress.task_id) || 'Unknown Task';
          
          mockActivityFeed.push({
            id: `task-${progress.id}`,
            userId: progress.user_id,
            userName: profile?.name || 'Unknown User',
            eventType: 'task_completed',
            taskId: progress.task_id,
            taskName: taskName,
            timestamp: progress.completed_at || progress.created_at,
            details: `Completed task: ${taskName}`
          });
        });
      }
      
      // Sort by timestamp, most recent first
      mockActivityFeed.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setActivityFeed(mockActivityFeed);
      
      // Process task performance data
      if (tasksData && progressData) {
        const taskBreakdown = tasksData.map(task => {
          const taskAttempts = progressData.filter(p => p.task_id === task.id);
          const completions = taskAttempts.filter(p => p.completed);
          
          // Calculate average time to complete
          let totalTime = 0;
          let timeCount = 0;
          
          completions.forEach(completion => {
            if (completion.completed_at) {
              const startTime = new Date(completion.created_at).getTime();
              const endTime = new Date(completion.completed_at).getTime();
              if (endTime > startTime) {
                totalTime += (endTime - startTime);
                timeCount++;
              }
            }
          });
          
          return {
            taskId: task.id,
            taskName: task.title,
            totalAttempts: taskAttempts.length,
            completions: completions.length,
            averageTime: timeCount > 0 ? totalTime / timeCount / (1000 * 60) : 0, // in minutes
            abandonmentRate: taskAttempts.length > 0 ? 
              (taskAttempts.length - completions.length) / taskAttempts.length * 100 : 0
          };
        });
        
        // Count tasks completed today
        const today = new Date().setHours(0, 0, 0, 0);
        const completedToday = progressData.filter(p => 
          p.completed && 
          p.completed_at && 
          new Date(p.completed_at).getTime() >= today
        ).length;
        
        const totalCompletions = progressData.filter(p => p.completed).length;
        const totalAttempts = progressData.length;
        
        setTaskPerformance({
          totalTasks: tasksData.length,
          completedTasks: totalCompletions,
          completionRate: totalAttempts > 0 ? (totalCompletions / totalAttempts) * 100 : 0,
          averageTimeToComplete: taskBreakdown.reduce((acc, task) => acc + task.averageTime, 0) / 
            taskBreakdown.filter(t => t.averageTime > 0).length || 0,
          completedToday,
          taskBreakdown
        });
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching monitor data:', err);
      setError(err.message);
      toast.error('Failed to load sprint monitor data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllMonitorData();
  }, []);

  // Return data and refresh function
  return {
    userProgressData,
    activityFeed,
    taskPerformance,
    isLoading,
    error,
    refreshMonitorData: fetchAllMonitorData
  };
};
