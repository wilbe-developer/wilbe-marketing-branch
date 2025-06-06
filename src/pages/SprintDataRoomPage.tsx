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
  task_id?: string;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  order_index: number;
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

// Helper function to recursively search for file objects in JSON
const extractFilesFromJSON = (obj: any, taskId: string): FileData[] => {
  const files: FileData[] = [];
  
  const searchObject = (item: any) => {
    if (item && typeof item === 'object') {
      // Check if this object looks like a file (has fileId, fileName, uploadedAt)
      if (item.fileId && item.fileName && item.uploadedAt) {
        files.push({
          id: item.fileId,
          file_name: item.fileName,
          download_url: '', // Will be filled later from user_files
          uploaded_at: item.uploadedAt,
          task_id: taskId
        });
      }
      
      // Recursively search in arrays and objects
      if (Array.isArray(item)) {
        item.forEach(searchObject);
      } else {
        Object.values(item).forEach(searchObject);
      }
    }
  };
  
  searchObject(obj);
  return files;
};

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
        
        // Fetch all sprint task definitions
        const { data: tasksData, error: tasksError } = await supabase
          .from("sprint_task_definitions")
          .select("id, name, description, definition")
          .order("definition->order_index");
        
        if (tasksError) throw tasksError;
        
        // Fetch user progress with task_answers
        const { data: progressData, error: progressError } = await supabase
          .from("user_sprint_progress")
          .select("task_id, task_answers")
          .eq("user_id", sprintId)
          .not("task_answers", "is", null);
        
        if (progressError) throw progressError;
        
        // Extract files from task_answers JSON
        const filesFromProgress: FileData[] = [];
        const taskFileMap = new Map<string, FileData[]>();
        
        progressData.forEach(progress => {
          if (progress.task_answers) {
            const extractedFiles = extractFilesFromJSON(progress.task_answers, progress.task_id);
            extractedFiles.forEach(file => {
              filesFromProgress.push(file);
              if (!taskFileMap.has(progress.task_id)) {
                taskFileMap.set(progress.task_id, []);
              }
              taskFileMap.get(progress.task_id)!.push(file);
            });
          }
        });
        
        // Get unique file IDs and fetch actual file data
        const fileIds = [...new Set(filesFromProgress.map(f => f.id))];
        let actualFilesData: any[] = [];
        
        if (fileIds.length > 0) {
          const { data: filesData, error: filesError } = await supabase
            .from("user_files")
            .select("id, file_name, download_url, uploaded_at")
            .eq("user_id", sprintId)
            .in("id", fileIds);
          
          if (filesError) throw filesError;
          actualFilesData = filesData || [];
        }
        
        // Merge file data with progress data
        const mergedFiles = new Map<string, FileData[]>();
        
        taskFileMap.forEach((taskFiles, taskId) => {
          const updatedFiles = taskFiles.map(progressFile => {
            const actualFile = actualFilesData.find(f => f.id === progressFile.id);
            return actualFile ? {
              ...progressFile,
              file_name: actualFile.file_name,
              download_url: actualFile.download_url,
              uploaded_at: actualFile.uploaded_at
            } : progressFile;
          }).filter(file => file.download_url); // Only include files with download URLs
          
          if (updatedFiles.length > 0) {
            mergedFiles.set(taskId, updatedFiles);
          }
        });
        
        // Only include tasks that have files and format them properly
        const tasksWithFiles: TaskData[] = tasksData
          .filter(task => mergedFiles.has(task.id))
          .map(task => {
            // Parse definition to get order_index
            let orderIndex = 0;
            if (task.definition && typeof task.definition === 'object') {
              const def = task.definition as any;
              orderIndex = def.order_index || 0;
            }
            
            return {
              id: task.id,
              title: task.name,
              description: task.description || "",
              order_index: orderIndex,
              files: mergedFiles.get(task.id) || []
            };
          })
          .sort((a, b) => a.order_index - b.order_index);
        
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
              <div key={task.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                
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
