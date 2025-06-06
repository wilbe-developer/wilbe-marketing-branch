
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDataRoomPrivacy = () => {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchPrivacySetting = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("data_room_public")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setIsPublic(data?.data_room_public || false);
    } catch (error: any) {
      console.error("Error fetching privacy setting:", error);
    }
  };

  const updatePrivacySetting = async (newIsPublic: boolean) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sprint_profiles")
        .upsert({ 
          user_id: user.id, 
          data_room_public: newIsPublic 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;

      setIsPublic(newIsPublic);
      toast({
        title: newIsPublic ? "Data room published" : "Data room made private",
        description: newIsPublic 
          ? "Your data room is now publicly accessible via link" 
          : "Your data room is now private and only accessible to you and your team"
      });
    } catch (error: any) {
      console.error("Error updating privacy setting:", error);
      toast({
        title: "Error updating privacy setting",
        description: error.message || "Please try again later",
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
