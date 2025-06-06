
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, File, Edit, Lock } from "lucide-react";
import { DataRoomSection } from "@/components/sprint/data-room/DataRoomSection";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Simplified interfaces
interface FileData {
  id: string;
  file_name: string;
  download_url: string;
  uploaded_at: string;
}

interface TaskData {
  task_id: string;
  task_name: string;
  task_description: string;
  task_order_index: number;
  files: FileData[];
}

interface OwnerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  institution?: string;
}

interface DataRoomData {
  profile: any;
  tasks: TaskData[];
}

const SprintDataRoomPage = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const [loading, setLoading] = useState(true);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const { user } = useAuth();

  const isOwnDataRoom = user?.id === sprintId;

  useEffect(() => {
    const fetchDataRoomData = async () => {
      if (!sprintId) return;
      
      setLoading(true);
      try {
        // First check if we have access to this data room
        const { data: accessCheck, error: accessError } = await supabase
          .rpc('can_access_data_room', { 
            p_sprint_owner_id: sprintId, 
            p_requesting_user_id: user?.id || null 
          });

        if (accessError) {
          console.error("Error checking access:", accessError);
          setHasAccess(false);
          setLoading(false);
          return;
        }

        if (!accessCheck) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

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
        
        // Use the new RPC function to get task data with files
        const { data: taskFileData, error: taskFileError } = await supabase
          .rpc('get_public_data_room_files', {
            p_sprint_owner_id: sprintId,
            p_requesting_user_id: user?.id || null
          });

        if (taskFileError) {
          console.error("Error fetching task files:", taskFileError);
          throw taskFileError;
        }

        // Process the RPC response into the expected format
        const tasksWithFiles: TaskData[] = (taskFileData || []).map((taskData: any) => ({
          task_id: taskData.task_id,
          task_name: taskData.task_name,
          task_description: taskData.task_description || "",
          task_order_index: taskData.task_order_index || 0,
          files: Array.isArray(taskData.files) ? taskData.files.filter((file: any) => file && file.id) : []
        })).filter((task: TaskData) => task.files.length > 0);
        
        setDataRoomData({
          profile: profileData || null,
          tasks: tasksWithFiles
        });
      } catch (error: any) {
        console.error("Error fetching data room data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data room",
          description: error.message || "Unable to load data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDataRoomData();
  }, [sprintId, user?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid gap-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Private Data Room</h1>
        <p className="text-gray-600 mb-6">
          This data room is private and not accessible to the public. 
          {!user && " Please log in if you have been granted access."}
        </p>
        <Button asChild>
          <Link to="/sprint/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!dataRoomData || !owner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Data Room Not Found</h1>
        <p className="text-gray-600 mb-6">
          The requested data could not be found. It may have been removed or you may not have permission to view it.
        </p>
        <Button asChild>
          <Link to="/sprint/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to="/sprint/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          {isOwnDataRoom && (
            <Button asChild>
              <Link to="/sprint/dashboard">
                <Edit className="mr-2 h-4 w-4" />
                Edit in Dashboard
              </Link>
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {dataRoomData.profile?.name || `${owner.first_name} ${owner.last_name}'s Project`}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {owner.institution ? `${owner.institution} • ` : ''}
          {owner.email}
        </p>
      </div>
      
      {/* BSF Challenges Section - Only show if there are tasks with files */}
      {dataRoomData.tasks.length > 0 ? (
        <DataRoomSection title="BSF Challenges & Documents">
          <div className="space-y-6">
            {dataRoomData.tasks.map((task) => (
              <div key={task.task_id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{task.task_name}</h3>
                <p className="text-gray-600 text-sm mb-4">{task.task_description}</p>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {task.files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-3 flex items-center bg-gray-50">
                      <File className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.file_name}</p>
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
              </div>
            ))}
          </div>
        </DataRoomSection>
      ) : (
        <div className="text-center py-12">
          <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-gray-500">
            No documents have been uploaded for any BSF challenges yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default SprintDataRoomPage;
