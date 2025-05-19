
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
import { UploadCloud } from "lucide-react";

interface UploadStepRendererProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload: (file: File) => void;
}

export const UploadStepRenderer: React.FC<UploadStepRendererProps> = ({
  step,
  answer,
  onAnswer,
  onFileUpload,
}) => {
  const [fileUploadState, setFileUploadState] = useState<{
    file: File | null;
    uploading: boolean;
    error: string | null;
  }>({
    file: null,
    uploading: false,
    error: null,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadState({
      file,
      uploading: true,
      error: null,
    });

    try {
      await onFileUpload(file);
      setFileUploadState({
        file,
        uploading: false,
        error: null,
      });
    } catch (error) {
      setFileUploadState({
        file,
        uploading: false,
        error: "Failed to upload file. Please try again.",
      });
    }
  };

  return (
    <>
      {answer ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="font-medium">File uploaded successfully:</p>
          <p className="text-sm mt-1">{answer.fileName}</p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            fileUploadState.error ? "border-red-300" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />

          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">
            Drag and drop a file here, or click to select
          </p>

          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-primary/5 focus:outline-none"
            >
              {fileUploadState.uploading ? "Uploading..." : "Select File"}
            </label>
          </div>

          {fileUploadState.file && !fileUploadState.uploading && !answer && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {fileUploadState.file.name}
            </p>
          )}

          {fileUploadState.error && (
            <p className="mt-2 text-sm text-red-500">{fileUploadState.error}</p>
          )}
        </div>
      )}
    </>
  );
};
