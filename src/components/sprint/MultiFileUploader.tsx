import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Download, File, Trash2 } from "lucide-react";
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
  maxFiles = 5
}) => {
  const [files, setFiles] = useState<FileData[]>(existingFiles);
  const [uploading, setUploading] = useState(false);
  const { uploadFile, isUploading } = useFileUpload();

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const handleFileUpload = async (selectedFiles: FileList) => {
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      return new Promise<FileData>((resolve, reject) => {
        uploadFile(file, {
          onSuccess: (response) => {
            resolve({
              fileId: response.id || response.fileId,
              fileName: file.name,
              uploadedAt: new Date().toISOString(),
              viewUrl: response.viewLink,
              downloadUrl: response.downloadLink
            });
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

  return (
    <div className="space-y-4">
      {/* Existing Files Display */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files ({files.length})</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                <div>Filename</div>
                <div>Date Uploaded</div>
                <div></div>
                <div className="text-right">Actions</div>
              </div>
            </div>
            <div className="divide-y">
              {files.map((file, index) => (
                <div key={`${file.fileId}-${index}`} className="px-4 py-3">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{file.fileName}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    
                    <div></div>
                    
                    <div className="flex justify-end space-x-2">
                      {file.downloadUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      {!isCompleted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload New Files */}
      {!isCompleted && files.length < maxFiles && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {files.length === 0 ? "Upload Files" : "Upload Additional Files"}
              </h3>
              <p className="text-gray-500 mb-4">
                {files.length === 0 
                  ? `Choose files to upload (max ${maxFiles})`
                  : `Add more files (${maxFiles - files.length} remaining)`
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
