
import { useEffect, useState } from "react";
import { useSharedSprint } from "@/hooks/useSharedSprint";
import { supabase } from "@/integrations/supabase/client";
import { Users, Lock, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface SharedSprintNotificationProps {
  taskId?: string;
}

export const SharedSprintNotification = ({ taskId }: SharedSprintNotificationProps) => {
  const { isSharedSprint, sprintOwnerId, isLoading } = useSharedSprint();
  const [ownerName, setOwnerName] = useState("");
  const [accessLevel, setAccessLevel] = useState<string | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!sprintOwnerId || !isSharedSprint) return;
      
      setLoadingOwner(true);
      try {
        // Fetch owner name
        const { data: ownerData, error: ownerError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", sprintOwnerId)
          .single();
          
        if (ownerError && ownerError.code !== 'PGRST116') {
          console.error("Error fetching owner profile:", ownerError);
        } else if (ownerData) {
          const fullName = [ownerData.first_name, ownerData.last_name]
            .filter(Boolean)
            .join(" ") || "Sprint Owner";
          setOwnerName(fullName);
        }
        
        // Get access level
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          const { data: accessData, error: accessError } = await supabase
            .from("sprint_collaborators")
            .select("access_level")
            .eq("sprint_owner_id", sprintOwnerId)
            .eq("collaborator_id", auth.user.id)
            .single();
            
          if (accessError && accessError.code !== 'PGRST116') {
            console.error("Error fetching access level:", accessError);
          } else if (accessData) {
            setAccessLevel(accessData.access_level);
          }
        }
      } catch (error) {
        console.error("Error in fetching owner details:", error);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchOwnerDetails();
  }, [sprintOwnerId, isSharedSprint]);

  if (isLoading || loadingOwner) {
    return (
      <Skeleton className="w-full h-16 mb-4" />
    );
  }

  if (!isSharedSprint) {
    return null;
  }

  const isViewOnly = accessLevel === "view";

  return (
    <Alert variant="default" className="mb-4 border-blue-200 bg-blue-50">
      <div className="flex items-start">
        <Users className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
        <div>
          <AlertTitle className="text-blue-700">
            {isViewOnly ? (
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" /> View-only access
              </span>
            ) : (
              <span>Collaborative sprint</span>
            )}
          </AlertTitle>
          <AlertDescription className="text-blue-600">
            You are viewing {ownerName}'s sprint. 
            {isViewOnly && " You can view but not edit this sprint."}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default SharedSprintNotification;
