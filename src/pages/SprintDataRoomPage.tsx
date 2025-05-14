
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, Download, File } from "lucide-react";
import { DataRoomSection } from "@/components/sprint/data-room/DataRoomSection";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface SprintData {
  profile: any;
  tasks: any[];
  files: any[];
  teamMembers: any[];
}

const SprintDataRoomPage = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const [loading, setLoading] = useState(true);
  const [sprintData, setSprintData] = useState<SprintData | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSprintData = async () => {
      if (!sprintId) return;
      
      setLoading(true);
      try {
        // Fetch owner profile first to identify the sprint owner
        const { data: ownerData, error: ownerError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, institution")
          .eq("id", sprintId)
          .single();
        
        if (ownerError) throw ownerError;
        setOwner(ownerData);
        
        // Fetch sprint profile
        const { data: profileData, error: profileError } = await supabase
          .from("sprint_profiles")
          .select("*")
          .eq("user_id", sprintId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        // Fetch tasks with progress
        const { data: tasksData, error: tasksError } = await supabase
          .from("sprint_tasks")
          .select(`
            *,
            progress:user_sprint_progress(
              id,
              completed,
              completed_at,
              file_id,
              task_answers
            )
          `)
          .eq("user_id", sprintId)
          .order("order_index");
        
        if (tasksError) throw tasksError;
        
        // Fetch uploaded files
        const { data: filesData, error: filesError } = await supabase
          .from("user_files")
          .select("*")
          .eq("user_id", sprintId);
        
        if (filesError) throw filesError;
        
        // Fetch team members
        const { data: teamData, error: teamError } = await supabase
          .from("team_members")
          .select("*")
          .eq("user_id", sprintId);
        
        if (teamError) throw teamError;
        
        setSprintData({
          profile: profileData || null,
          tasks: tasksData || [],
          files: filesData || [],
          teamMembers: teamData || []
        });
      } catch (error: any) {
        console.error("Error fetching sprint data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data room",
          description: error.message || "Unable to load sprint data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSprintData();
  }, [sprintId, toast]);

  // Organize tasks by category
  const organizeTasksByCategory = () => {
    if (!sprintData?.tasks) return {};
    
    const completedTasks = sprintData.tasks.filter(task => 
      task.progress && task.progress.length > 0 && task.progress[0].completed
    );
    
    return completedTasks.reduce((acc: Record<string, any[]>, task) => {
      const category = task.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {});
  };

  const tasksByCategory = organizeTasksByCategory();
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid gap-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!sprintData || !owner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sprint Data Not Found</h1>
        <p className="text-gray-600 mb-6">
          The requested sprint data could not be found. It may have been removed or you may not have permission to view it.
        </p>
        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          asChild
        >
          <Link to="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-2">
          {sprintData.profile?.name || `${owner.first_name} ${owner.last_name}'s Project`}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {owner.institution ? `${owner.institution} • ` : ''}
          {owner.email}
        </p>
      </div>
      
      {/* Executive Summary Section */}
      <DataRoomSection title="Executive Summary">
        <div className="space-y-4">
          {sprintData.profile && (
            <>
              {sprintData.profile.vision && (
                <div>
                  <h3 className="font-medium text-gray-900">Vision</h3>
                  <p>{sprintData.profile.vision}</p>
                </div>
              )}
              
              {tasksByCategory['Vision'] && tasksByCategory['Vision'].map((task) => (
                <div key={task.id} className="mt-4">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {task.progress[0].task_answers && (
                    <div className="prose max-w-none">
                      <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {!sprintData.profile && !tasksByCategory['Vision'] && (
            <p className="text-gray-500 italic">No executive summary information available yet.</p>
          )}
        </div>
      </DataRoomSection>
      
      {/* Team Section */}
      <DataRoomSection title="Team">
        <div className="space-y-4">
          {sprintData.teamMembers && sprintData.teamMembers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {sprintData.teamMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.employment_status}</p>
                  <p className="mt-2 text-sm">{member.profile_description}</p>
                </div>
              ))}
            </div>
          ) : (
            tasksByCategory['Team'] ? (
              tasksByCategory['Team'].map((task) => (
                <div key={task.id}>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {task.progress[0].task_answers && (
                    <div className="prose max-w-none">
                      <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No team information available yet.</p>
            )
          )}
        </div>
      </DataRoomSection>
      
      {/* Problem Section */}
      {(tasksByCategory['Problem'] || []).length > 0 && (
        <DataRoomSection title="Problem Statement">
          <div className="space-y-4">
            {tasksByCategory['Problem'].map((task) => (
              <div key={task.id}>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.progress[0].task_answers && (
                  <div className="prose max-w-none">
                    <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataRoomSection>
      )}
      
      {/* Science/IP Section */}
      {(tasksByCategory['Science'] || []).concat(tasksByCategory['IP'] || []).length > 0 && (
        <DataRoomSection title="Science & IP">
          <div className="space-y-4">
            {[...(tasksByCategory['Science'] || []), ...(tasksByCategory['IP'] || [])].map((task) => (
              <div key={task.id}>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.progress[0].task_answers && (
                  <div className="prose max-w-none">
                    <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataRoomSection>
      )}
      
      {/* Market/Customer Section */}
      {(tasksByCategory['Market'] || []).concat(tasksByCategory['Customer'] || []).length > 0 && (
        <DataRoomSection title="Market & Customers">
          <div className="space-y-4">
            {[...(tasksByCategory['Market'] || []), ...(tasksByCategory['Customer'] || [])].map((task) => (
              <div key={task.id}>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.progress[0].task_answers && (
                  <div className="prose max-w-none">
                    <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataRoomSection>
      )}
      
      {/* Experiment/Funding Section */}
      {(tasksByCategory['Experiment'] || []).concat(tasksByCategory['Funding'] || []).length > 0 && (
        <DataRoomSection title="Validation & Funding">
          <div className="space-y-4">
            {[...(tasksByCategory['Experiment'] || []), ...(tasksByCategory['Funding'] || [])].map((task) => (
              <div key={task.id}>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.progress[0].task_answers && (
                  <div className="prose max-w-none">
                    <p>{JSON.stringify(task.progress[0].task_answers)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DataRoomSection>
      )}
      
      {/* Documents Section */}
      <DataRoomSection title="Documents">
        <div className="space-y-4">
          {sprintData.files && sprintData.files.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {sprintData.files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 flex items-center">
                  <File className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(file.download_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents uploaded yet.</p>
          )}
        </div>
      </DataRoomSection>
    </div>
  );
};

export default SprintDataRoomPage;
