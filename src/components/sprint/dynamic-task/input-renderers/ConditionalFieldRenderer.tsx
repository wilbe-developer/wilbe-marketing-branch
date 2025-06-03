
import React, { useState } from "react";
import { FormField } from "@/types/task-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";
import FileUploader from "@/components/sprint/FileUploader";

interface ConditionalFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const ConditionalFieldRenderer: React.FC<ConditionalFieldRendererProps> = ({
  field,
  value,
  onChange,
}) => {
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  // Handle file upload
  const handleFileUpload = (fileId: string) => {
    onChange(field.id, {
      fileId,
      fileName: `Uploaded File (ID: ${fileId})`,
      uploadedAt: new Date().toISOString()
    });
  };

  // Render a collaboration field
  const renderCollaborationField = () => {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-3">{field.label || "Team Collaboration"}</h4>
        {field.text && <p className="text-sm text-blue-700 mb-4">{field.text}</p>}
        {!field.text && (
          <p className="text-sm text-blue-700 mb-4">
            Invite your team members to collaborate on this BSF. They will be able to view and contribute to tasks.
          </p>
        )}
        
        <Button 
          onClick={() => setIsCollaboratorsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Manage Collaborators</span>
        </Button>
        
        <Dialog open={isCollaboratorsDialogOpen} onOpenChange={setIsCollaboratorsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Team Collaborators</DialogTitle>
              <DialogDescription>
                Add or remove team members who can collaborate on your BSF.
              </DialogDescription>
            </DialogHeader>
            
            <CollaboratorsManagement />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Render a content field
  const renderContentField = () => {
    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
  };

  // Determine the correct component to render based on field type
  if (field.type === 'collaboration' || field.id === 'invite_link') {
    return renderCollaborationField();
  }

  if (field.type === 'content') {
    return renderContentField();
  }

  if (field.type === 'text') {
    return (
      <div className="space-y-2">
        {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
        <Input
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder || ''}
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
        <Textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder || ''}
          rows={4}
        />
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="space-y-2">
        {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
        <Select
          value={value || ''}
          onValueChange={(value) => onChange(field.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === 'file' || field.type === 'upload') {
    return (
      <div className="mt-2">
        {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
        <FileUploader
          onFileUploaded={(fileId) => handleFileUpload(fileId)}
          isCompleted={false}
        />
        {value && (
          <div className="mt-2 text-sm text-green-600">
            File uploaded: {value.fileName || `File ID: ${value.fileId}`}
          </div>
        )}
      </div>
    );
  }

  return null;
};
