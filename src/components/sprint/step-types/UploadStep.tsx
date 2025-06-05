
import React, { useState, useEffect } from "react";
import { MultiFileUploader } from "../MultiFileUploader";
import { toast } from "sonner";

interface FileData {
  fileId: string;
  fileName: string;
  uploadedAt: string;
  viewUrl?: string;
  downloadUrl?: string;
}

interface UploadStepProps {
  action?: string;
  uploads?: string[];
  isCompleted: boolean;
  onComplete: (files?: FileData[]) => void;
  existingFiles?: FileData[];
}

const UploadStep: React.FC<UploadStepProps> = ({
  action,
  uploads,
  isCompleted,
  onComplete,
  existingFiles = []
}) => {
  const [files, setFiles] = useState<FileData[]>(existingFiles);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);
  
  const handleFilesChange = (updatedFiles: FileData[]) => {
    setFiles(updatedFiles);
    setUploadError(null);
    
    // Auto-complete when files are uploaded
    if (updatedFiles.length > 0 && !isCompleted) {
      onComplete(updatedFiles);
    }
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    toast.error(`Upload failed: ${error}`);
  };
  
  return (
    <div>
      {action && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700">{action}</p>
        </div>
      )}
      
      {uploads && uploads.length > 0 && (
        <>
          <div className="mb-2 font-medium">Required uploads:</div>
          <ul className="list-disc list-inside mb-4">
            {uploads.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}
      
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <p className="text-sm font-medium">Upload error: {uploadError}</p>
          <p className="text-xs mt-1">Please try again or contact support if the issue persists.</p>
        </div>
      )}
      
      <MultiFileUploader
        existingFiles={files}
        onFilesChange={handleFilesChange}
        isCompleted={isCompleted}
        maxFiles={5}
      />
      
      {isCompleted && files.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            ✓ Task completed with {files.length} file(s) uploaded
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadStep;
