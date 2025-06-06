
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDataRoomPrivacy = (targetUserId?: string) => {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Use targetUserId if provided, otherwise fall back to current user
  const userId = targetUserId || user?.id;
  
  // Check if current user can manage the target user's privacy settings
  const canManagePrivacy = user?.id === userId;

  const fetchPrivacySetting = async () => {
    if (!userId) {
      console.log("No user ID available for fetching privacy setting");
      return;
    }
    
    console.log("Fetching privacy setting for user:", userId);
    
    try {
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("data_room_public")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log("No sprint profile found for user:", userId);
          setIsPublic(false);
          return;
        }
        console.error("Error fetching privacy setting:", error);
        if (canManagePrivacy) {
          toast({
            title: "Error loading privacy setting",
            description: error.message || "Unable to load data room privacy setting",
            variant: "destructive"
          });
        }
        return;
      }
      
      console.log("Privacy setting fetched successfully:", data?.data_room_public);
      setIsPublic(data?.data_room_public || false);
    } catch (error: any) {
      console.error("Unexpected error fetching privacy setting:", error);
      if (canManagePrivacy) {
        toast({
          title: "Error loading privacy setting",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    }
  };

  const updatePrivacySetting = async (newIsPublic: boolean) => {
    if (!user?.id) {
      console.error("No user ID available for updating privacy setting");
      toast({
        title: "Authentication required",
        description: "Please log in to update privacy settings",
        variant: "destructive"
      });
      return;
    }

    if (!canManagePrivacy) {
      console.error("User cannot manage this data room's privacy settings");
      toast({
        title: "Permission denied",
        description: "You can only manage your own data room privacy settings",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Updating privacy setting to:", newIsPublic, "for user:", userId);
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_profiles")
        .upsert({ 
          user_id: userId, 
          data_room_public: newIsPublic 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) {
        console.error("Error updating privacy setting:", error);
        
        if (error.code === '42501') {
          toast({
            title: "Permission denied",
            description: "You don't have permission to update this data room setting",
            variant: "destructive"
          });
        } else if (error.code === '23505') {
          toast({
            title: "Duplicate entry",
            description: "There was a conflict updating your privacy setting. Please try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error updating privacy setting",
            description: error.message || "Please try again later",
            variant: "destructive"
          });
        }
        return;
      }

      console.log("Privacy setting updated successfully");
      setIsPublic(newIsPublic);
      toast({
        title: newIsPublic ? "Data room published" : "Data room made private",
        description: newIsPublic 
          ? "Your data room is now publicly accessible via link" 
          : "Your data room is now private and only accessible to you and your team"
      });
    } catch (error: any) {
      console.error("Unexpected error updating privacy setting:", error);
      toast({
        title: "Error updating privacy setting",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacySetting();
  }, [userId]);

  return {
    isPublic,
    isLoading,
    updatePrivacySetting,
    refetch: fetchPrivacySetting,
    canManagePrivacy
  };
};
