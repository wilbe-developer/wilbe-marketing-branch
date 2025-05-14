
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, File } from "lucide-react";
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

interface OwnerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  institution?: string;
}

interface DataRoomData {
  profile: any;
  files: FileData[];
}

const SprintDataRoomPage = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const [loading, setLoading] = useState(true);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDataRoomData = async () => {
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
        
        // Fetch uploaded files
        const { data: filesData, error: filesError } = await supabase
          .from("user_files")
          .select("id, file_name, download_url, uploaded_at")
          .eq("user_id", sprintId);
        
        if (filesError) throw filesError;
        
        setDataRoomData({
          profile: profileData || null,
          files: filesData || []
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
  }, [sprintId]);

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

  if (!dataRoomData || !owner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Data Room Not Found</h1>
        <p className="text-gray-600 mb-6">
          The requested data could not be found. It may have been removed or you may not have permission to view it.
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
          {dataRoomData.profile?.name || `${owner.first_name} ${owner.last_name}'s Project`}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {owner.institution ? `${owner.institution} • ` : ''}
          {owner.email}
        </p>
      </div>
      
      {/* Executive Summary Section */}
      <DataRoomSection title="Executive Summary">
        <div className="space-y-4">
          {dataRoomData.profile && dataRoomData.profile.vision ? (
            <div>
              <h3 className="font-medium text-gray-900">Vision</h3>
              <p>{dataRoomData.profile.vision}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No executive summary information available yet.</p>
          )}
        </div>
      </DataRoomSection>
      
      {/* Documents Section */}
      <DataRoomSection title="Documents">
        <div className="space-y-4">
          {dataRoomData.files && dataRoomData.files.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {dataRoomData.files.map((file) => (
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
