import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, File, Trash2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileData {
  fileId: string;
  fileName: string;
  uploadedAt: string;
  viewUrl?: string;
  downloadUrl?: string;
}

interface MultiFileUploaderProps {
  existingFiles?: FileData[];
  onFilesChange: (files: FileData[]) => void;
  isCompleted?: boolean;
  maxFiles?: number;
}

export const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  existingFiles = [],
  onFilesChange,
  isCompleted = false,
  maxFiles
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const { uploadFile, isUploading } = useFileUpload();

  // Fetch complete file details from database using file IDs
  const fetchFilesFromDatabase = async (fileIds: string[]) => {
    if (fileIds.length === 0) return [];
    
    try {
      const { data, error } = await supabase
        .from("user_files")
        .select("id, file_name, uploaded_at, download_url, view_url")
        .in("id", fileIds);

      if (error) {
        console.error("Error fetching files from database:", error);
        return [];
      }

      return data.map(file => ({
        fileId: file.id,
        fileName: file.file_name,
        uploadedAt: file.uploaded_at,
        downloadUrl: file.download_url,
        viewUrl: file.view_url
      }));
    } catch (error) {
      console.error("Error in fetchFilesFromDatabase:", error);
      return [];
    }
  };

  // Initialize files from existing data
  useEffect(() => {
    const initializeFiles = async () => {
      if (existingFiles.length > 0) {
        // Check if we have file IDs to fetch from database
        const fileIds = existingFiles
          .map(file => file.fileId)
          .filter(Boolean);
        
        if (fileIds.length > 0) {
          // Fetch complete file data from database
          const dbFiles = await fetchFilesFromDatabase(fileIds);
          if (dbFiles.length > 0) {
            setFiles(dbFiles);
            return;
          }
        }
        
        // Fallback to existing files if database fetch fails
        setFiles(existingFiles);
      }
    };

    initializeFiles();
  }, [existingFiles]);

  const handleFileUpload = async (selectedFiles: FileList) => {
    if (maxFiles && files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      return new Promise<FileData>((resolve, reject) => {
        uploadFile(file, {
          onSuccess: async (response) => {
            // Fetch the complete file details from database
            const dbFiles = await fetchFilesFromDatabase([response.id || response.fileId]);
            
            if (dbFiles.length > 0) {
              resolve(dbFiles[0]);
            } else {
              // Fallback if database fetch fails
              resolve({
                fileId: response.id || response.fileId,
                fileName: file.name,
                uploadedAt: new Date().toISOString(),
                viewUrl: response.viewLink,
                downloadUrl: response.downloadLink
              });
            }
          },
          onError: (error) => reject(error)
        });
      });
    });

    try {
      const newFiles = await Promise.all(uploadPromises);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload one or more files");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileToDelete: FileData) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from("user_files")
        .delete()
        .eq("id", fileToDelete.fileId);

      if (error) throw error;

      const updatedFiles = files.filter(f => f.fileId !== fileToDelete.fileId);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDownload = (file: FileData) => {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, '_blank');
    } else {
      toast.error("Download link not available");
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Files Display */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Uploaded Files ({files.length})</h4>
          
          {/* Desktop: Grid layout, Mobile: Stacked cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Card key={`${file.fileId}-${index}`} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    {/* File Info */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <File className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(file)}
                        className="flex-1"
                        title="Download file"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFile(file)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Files */}
      {!isCompleted && (!maxFiles || files.length < maxFiles) && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {files.length === 0 ? "Upload Files" : "Upload Additional Files"}
              </h3>
              <p className="text-gray-500 mb-4">
                {files.length === 0 
                  ? "Choose files to upload"
                  : "Add more files"
                }
              </p>
              
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={uploading || isUploading}
              />
              
              <Button 
                asChild 
                disabled={uploading || isUploading}
                className="w-full"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploading || isUploading ? "Uploading..." : "Choose Files"}
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isCompleted && files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No files uploaded for this task</p>
        </div>
      )}
    </div>
  );
};
