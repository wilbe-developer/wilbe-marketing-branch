
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
import FileUploader from "@/components/sprint/FileUploader";

interface UploadStepRendererProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload?: (file: File) => void;
}

export const UploadStepRenderer: React.FC<UploadStepRendererProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
}) => {
  // Handle successful file upload
  const handleFileUploaded = (fileId: string) => {
    // If fileId is available, use it to create a proper answer object with metadata
    onAnswer({
      fileId,
      fileName: `Uploaded File (ID: ${fileId})`,
      uploadedAt: new Date().toISOString()
    });
  };

  // Handle upload completion - this is for more complex upload scenarios
  const handleUploadComplete = async (fileId?: string) => {
    if (fileId) {
      // Additional processing can be done here if needed
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  return (
    <div className="space-y-4">
      {answer ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="font-medium">File uploaded successfully:</p>
          <p className="text-sm mt-1">{answer.fileName || `File ID: ${answer.fileId}`}</p>
        </div>
      ) : (
        <FileUploader
          onFileUploaded={handleFileUploaded}
          onUploadComplete={handleUploadComplete}
          onUploadError={(error) => console.error("Upload error:", error)}
          isCompleted={false}
        />
      )}
    </div>
  );
};
