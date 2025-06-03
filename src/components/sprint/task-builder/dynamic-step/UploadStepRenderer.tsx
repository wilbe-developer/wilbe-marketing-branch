
import React, { useState, useEffect } from "react";
import { StepNode } from "@/types/task-builder";
import { MultiFileUploader } from "@/components/sprint/MultiFileUploader";

interface FileData {
  fileId: string;
  fileName: string;
  uploadedAt: string;
  viewUrl?: string;
  downloadUrl?: string;
}

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
  const [existingFiles, setExistingFiles] = useState<FileData[]>([]);

  // Parse existing files from answer
  useEffect(() => {
    if (answer) {
      if (Array.isArray(answer)) {
        // Handle array of files
        setExistingFiles(answer);
      } else if (answer.fileId) {
        // Handle single file (legacy format)
        setExistingFiles([{
          fileId: answer.fileId,
          fileName: answer.fileName || `File ${answer.fileId}`,
          uploadedAt: answer.uploadedAt || new Date().toISOString(),
          viewUrl: answer.viewUrl,
          downloadUrl: answer.downloadUrl
        }]);
      }
    }
  }, [answer]);

  const handleFilesChange = (files: FileData[]) => {
    // Update the answer with the new files array
    onAnswer(files);
  };

  return (
    <div className="space-y-4">
      <MultiFileUploader
        existingFiles={existingFiles}
        onFilesChange={handleFilesChange}
        isCompleted={false}
        maxFiles={5}
      />
    </div>
  );
};
