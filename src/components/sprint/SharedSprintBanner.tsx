
import { useEffect, useState } from "react";
import { useSharedSprint } from "@/hooks/useSharedSprint";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users } from "lucide-react";

export const SharedSprintBanner = () => {
  const { isSharedSprint, sprintOwnerId, isLoading } = useSharedSprint();
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!isSharedSprint || !sprintOwnerId) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", sprintOwnerId)
          .single();

        if (error) throw error;
        
        if (data) {
          const fullName = [data.first_name, data.last_name]
            .filter(Boolean)
            .join(" ");
          setOwnerName(fullName || "Sprint Owner");
        }
      } catch (error) {
        console.error("Error fetching owner details:", error);
      }
    };

    fetchOwnerDetails();
  }, [isSharedSprint, sprintOwnerId]);

  if (isLoading || !isSharedSprint) {
    return null;
  }

  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
      <Users className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Shared Sprint</AlertTitle>
      <AlertDescription className="text-blue-700">
        You're viewing a sprint shared by {ownerName}. Any changes you make will be visible to the sprint owner.
      </AlertDescription>
    </Alert>
  );
};
