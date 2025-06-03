
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  progressPercentage: number;
}

export const useSprintCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    progressPercentage: 0
  });
  const [sprintStartDate, setSprintStartDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const SPRINT_DURATION_DAYS = 10;
  const SPRINT_DURATION_MS = SPRINT_DURATION_DAYS * 24 * 60 * 60 * 1000;

  const calculateTimeLeft = (startDate: string): CountdownTime => {
    const start = new Date(startDate).getTime();
    const end = start + SPRINT_DURATION_MS;
    const now = new Date().getTime();
    const difference = end - now;
    const elapsed = now - start;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        progressPercentage: 100
      };
    }

    const progressPercentage = Math.min((elapsed / SPRINT_DURATION_MS) * 100, 100);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
      progressPercentage
    };
  };

  const fetchSprintStartDate = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("sprint_start_date")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching sprint start date:", error);
        return;
      }

      setSprintStartDate(data?.sprint_start_date || null);
    } catch (error) {
      console.error("Error in fetchSprintStartDate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSprint = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const startDate = new Date().toISOString();
      
      const { error } = await supabase
        .from("sprint_profiles")
        .update({ sprint_start_date: startDate })
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to start sprint timer");
        console.error("Error starting sprint:", error);
        return;
      }

      setSprintStartDate(startDate);
      toast.success("10-day sprint timer started! 🚀");
    } catch (error) {
      toast.error("Failed to start sprint timer");
      console.error("Error in startSprint:", error);
    }
  };

  useEffect(() => {
    fetchSprintStartDate();
  }, [user?.id]);

  useEffect(() => {
    if (!sprintStartDate) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        progressPercentage: 0
      });
      return;
    }

    // Initialize countdown
    setTimeLeft(calculateTimeLeft(sprintStartDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(sprintStartDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [sprintStartDate]);

  return {
    timeLeft,
    sprintStartDate,
    isLoading,
    startSprint,
    hasStarted: !!sprintStartDate
  };
};
