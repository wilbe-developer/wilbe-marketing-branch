
import React from "react";
import FileUploader from "@/components/sprint/FileUploader";

type UploadStepProps = {
  uploads: string[];
  action?: string;
  onFileUploaded: (fileId: string) => void;
  readOnly?: boolean;
};

const UploadStep: React.FC<UploadStepProps> = ({ uploads, action, onFileUploaded, readOnly = false }) => {
  return (
    <div className="space-y-4">
      {action && <p className="text-gray-700 mb-4">{action}</p>}
      <div>
        <div className="font-medium mb-2">Required uploads:</div>
        <ul className="list-disc list-inside mb-4">
          {uploads.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>
      <FileUploader 
        onFileUploaded={onFileUploaded} 
        isCompleted={false}
        readOnly={readOnly}
      />
    </div>
  );
};

export default UploadStep;
