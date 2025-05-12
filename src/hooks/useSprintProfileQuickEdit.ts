
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useSprintProfileQuickEdit = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch sprint profile (one per user)
  const { data: sprintProfile, isLoading } = useQuery({
    queryKey: ["sprintProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update a profile field
  const updateSprintProfile = useMutation({
    mutationFn: async (updates: Partial<any>) => {
      if (!user) throw new Error("No user found");
      
      const { data, error } = await supabase
        .from("sprint_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Immediately update the cache with the new data to ensure UI updates instantly
      queryClient.setQueryData(["sprintProfile", user?.id], data);
      
      // Also invalidate the query to ensure fresh data on next query
      queryClient.invalidateQueries({ queryKey: ["sprintProfile", user?.id] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  });

  return { sprintProfile, isLoading, updateSprintProfile };
};
