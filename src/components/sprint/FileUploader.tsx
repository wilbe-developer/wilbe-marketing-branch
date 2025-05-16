
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileUploaded: (fileId: string) => void;
  onUploadError?: (error: string) => void;
  taskId?: string;
  onUploadComplete?: (fileId?: string) => Promise<void>;
  isCompleted?: boolean;
}

const FileUploader = ({ 
  onFileUploaded, 
  onUploadError,
  taskId, 
  onUploadComplete,
  isCompleted 
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useFileUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile, {
        onSuccess: (data) => {
          console.log("File upload succeeded:", data);
          
          if (data && data.fileId) {
            // Use onUploadComplete if provided, otherwise fall back to onFileUploaded
            if (onUploadComplete) {
              onUploadComplete(data.fileId)
                .then(() => {
                  onFileUploaded(data.fileId);
                  setSelectedFile(null);
                })
                .catch(err => {
                  console.error("Error in onUploadComplete:", err);
                  if (onUploadError) onUploadError("Failed to process upload.");
                  else toast.error("Failed to process upload.");
                });
            } else {
              onFileUploaded(data.fileId);
              setSelectedFile(null);
            }
          } else {
            console.error("Upload succeeded but no file ID returned:", data);
            if (onUploadError) onUploadError("Upload succeeded but no file ID returned.");
            else toast.error("Upload succeeded but no file ID returned.");
          }
        },
        onError: (error) => {
          console.error("File upload error:", error);
          const errorMessage = error?.message || "Unknown upload error";
          if (onUploadError) onUploadError(errorMessage);
          else toast.error(`Upload failed: ${errorMessage}`);
        }
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="space-y-4"
        >
          <div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isCompleted}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompleted}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {isUploading ? (
            <div className="space-y-3">
              <div className="animate-pulse bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Uploading {selectedFile.name}</p>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <File className="h-8 w-8 text-gray-600" />
                </div>
                <button
                  onClick={clearFile}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                  title="Remove file"
                  disabled={isCompleted}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium truncate max-w-xs mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={handleUpload}
                  disabled={isCompleted}
                >
                  Upload File
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
