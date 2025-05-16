
import React, { useState, useEffect } from "react";
import FileUploader from "../FileUploader";
import UploadedFileView from "../UploadedFileView";
import { toast } from "sonner";

interface UploadStepProps {
  action?: string;
  uploads?: string[];
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({
  action,
  uploads,
  isCompleted,
  onComplete,
}) => {
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Check if there's any file saved in the parent state
  useEffect(() => {
    // The file will be set by the FileUploader component
  }, []);
  
  const handleFileUploaded = (fileId: string) => {
    setUploadedFileId(fileId);
    setUploadError(null); // Clear any previous errors
  };
  
  const handleCompleteUpload = () => {
    if (uploadedFileId) {
      onComplete(uploadedFileId);
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
      
      {uploadedFileId ? (
        <div className="mb-4">
          <UploadedFileView fileId={uploadedFileId} />
          <div className="mt-4 flex justify-between">
            <button 
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setUploadedFileId(undefined)}
              disabled={isCompleted}
            >
              Upload a different file
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
              onClick={handleCompleteUpload}
              disabled={isCompleted}
            >
              {isCompleted ? "Completed" : "Confirm Upload"}
            </button>
          </div>
        </div>
      ) : (
        <FileUploader
          onFileUploaded={handleFileUploaded}
          onUploadError={handleUploadError}
          isCompleted={isCompleted}
        />
      )}
    </div>
  );
};

export default UploadStep;
