
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDataRoomPrivacy = () => {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchPrivacySetting = async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching privacy setting");
      return;
    }
    
    console.log("Fetching privacy setting for user:", user.id);
    
    try {
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("data_room_public")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log("No sprint profile found for user:", user.id);
          setIsPublic(false);
          return;
        }
        console.error("Error fetching privacy setting:", error);
        toast({
          title: "Error loading privacy setting",
          description: error.message || "Unable to load data room privacy setting",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Privacy setting fetched successfully:", data?.data_room_public);
      setIsPublic(data?.data_room_public || false);
    } catch (error: any) {
      console.error("Unexpected error fetching privacy setting:", error);
      toast({
        title: "Error loading privacy setting",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
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
    
    console.log("Updating privacy setting to:", newIsPublic, "for user:", user.id);
    
    setIsLoading(true);
    try {
      // Use upsert with the correct conflict resolution now that we have the unique constraint
      const { error } = await supabase
        .from("sprint_profiles")
        .upsert({ 
          user_id: user.id, 
          data_room_public: newIsPublic 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) {
        console.error("Error updating privacy setting:", error);
        
        // Handle specific error types
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
  }, [user?.id]);

  return {
    isPublic,
    isLoading,
    updatePrivacySetting,
    refetch: fetchPrivacySetting
  };
};
