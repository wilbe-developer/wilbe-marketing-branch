
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, CheckCircle } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileUploaded: (fileId: string) => void;
  onUploadComplete?: (fileId?: string) => Promise<void>;
  onUploadError?: (error: string) => void;
  isCompleted: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  onUploadComplete,
  onUploadError,
  isCompleted
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const { uploadFile, isUploading, progress } = useFileUpload();

  const handleFileSelection = async (file: File) => {
    if (!file) return;

    uploadFile(file, {
      onSuccess: async (response) => {
        const fileId = response.id || response.fileId;
        setUploadedFileInfo({
          id: fileId,
          name: file.name
        });
        
        onFileUploaded(fileId);
        
        if (onUploadComplete) {
          await onUploadComplete(fileId);
        }
        
        toast.success("File uploaded successfully!");
      },
      onError: (error) => {
        console.error("Upload error:", error);
        const errorMessage = error.message || "Upload failed";
        if (onUploadError) {
          onUploadError(errorMessage);
        }
        toast.error(`Upload failed: ${errorMessage}`);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  if (isCompleted && uploadedFileInfo) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">File Uploaded Successfully</h3>
              <p className="text-sm text-green-600">{uploadedFileInfo.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        dragOver
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload File</h3>
          <p className="text-gray-500 mb-4">
            Drag and drop a file here, or click to select
          </p>
          
          {isUploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">Uploading... {progress}%</p>
            </div>
          )}
          
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            className="hidden"
            id="file-upload-single"
            disabled={isUploading || isCompleted}
          />
          
          <Button 
            asChild 
            disabled={isUploading || isCompleted}
            className="w-full"
          >
            <label htmlFor="file-upload-single" className="cursor-pointer">
              {isUploading ? "Uploading..." : "Choose File"}
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
