
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";

export const NotificationManager = () => {
  const { user } = useAuth();
  const [checkedCollaborators, setCheckedCollaborators] = useState(false);

  useEffect(() => {
    // Function to check for new collaborator invitations
    const checkNewCollaborations = async () => {
      if (!user?.id || checkedCollaborators) return;
      
      try {
        // Get the timestamp of the last check from localStorage
        const lastCheck = localStorage.getItem('lastCollaboratorCheck') || '0';
        const lastCheckTime = parseInt(lastCheck, 10);
        
        // Fetch recent collaborator additions
        const { data: collabData, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("sprint_owner_id, created_at")
          .eq("collaborator_id", user.id)
          .gt("created_at", new Date(lastCheckTime).toISOString());
          
        if (collabError) throw collabError;
        
        // If we have new collaborations, fetch owner names and notify
        if (collabData && collabData.length > 0) {
          for (const collab of collabData) {
            try {
              const { data: ownerData } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", collab.sprint_owner_id)
                .single();
                
              const ownerName = ownerData 
                ? `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim() 
                : 'Someone';
                
              toast({
                title: "New Sprint Collaboration",
                description: `${ownerName} has added you as a collaborator on their sprint project.`,
                action: (
                  <div className="p-2 bg-blue-50 rounded-md flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                )
              });
            } catch (err) {
              console.error("Error fetching owner details:", err);
            }
          }
        }
        
        // Update the last check timestamp
        localStorage.setItem('lastCollaboratorCheck', Date.now().toString());
        setCheckedCollaborators(true);
      } catch (error) {
        console.error("Error checking for collaborations:", error);
      }
    };
    
    // Run the check when the component mounts
    checkNewCollaborations();
    
    // Set up a subscription to detect new collaborations in real-time
    const channel = supabase
      .channel('public:sprint_collaborators')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sprint_collaborators',
          filter: `collaborator_id=eq.${user?.id}`
        }, 
        async (payload) => {
          try {
            const ownerId = payload.new.sprint_owner_id;
            const { data: ownerData } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", ownerId)
              .single();
              
            const ownerName = ownerData 
              ? `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim() 
              : 'Someone';
              
            toast({
              title: "New Sprint Collaboration",
              description: `${ownerName} has added you as a collaborator on their sprint project.`,
              action: (
                <div className="p-2 bg-blue-50 rounded-md flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              )
            });
          } catch (err) {
            console.error("Error processing realtime notification:", err);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, checkedCollaborators]);

  // This component doesn't render anything visible
  return null;
};

export default NotificationManager;
