import React, { useState, useEffect } from 'react';
import { StepNode, FormField } from '@/types/task-builder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CollaboratorsManagement } from '@/components/sprint/CollaboratorsManagement';
import { MultiFileUploader } from '@/components/sprint/MultiFileUploader';

interface FileData {
  fileId: string;
  fileName: string;
  uploadedAt: string;
  viewUrl?: string;
  downloadUrl?: string;
}

interface FormStepRendererProps {
  step: StepNode;
  answer: Record<string, any> | null;
  handleAnswer: (value: Record<string, any>) => void;
}

export const FormStepRenderer: React.FC<FormStepRendererProps> = ({
  step,
  answer,
  handleAnswer,
}) => {
  // Initialize form state with existing answers or empty object
  const [formValues, setFormValues] = useState<Record<string, any>>(answer || {});
  const [isCollaboratorsDialogOpen, setIsCollaboratorsDialogOpen] = useState(false);

  // Update local state when answer prop changes
  useEffect(() => {
    if (answer) {
      setFormValues(answer);
    }
  }, [answer]);

  // Handle field value change
  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedValues = { ...formValues, [fieldId]: value };
    setFormValues(updatedValues);
    handleAnswer(updatedValues);
  };

  // Handle multi-file upload
  const handleMultiFileUpload = (fieldId: string, files: FileData[]) => {
    handleFieldChange(fieldId, files);
  };

  // Normalize field properties (handle both type and inputType)
  const normalizeFieldType = (field: any) => {
    return {
      ...field,
      type: field.type || field.inputType,
    };
  };

  // Render a content field
  const renderContentField = (field: FormField) => {
    return (
      <div className="prose max-w-none mt-2">
        {field.content && (
          <div dangerouslySetInnerHTML={{ __html: field.content }} />
        )}
        {field.text && <p>{field.text}</p>}
      </div>
    );
  };

  // Render a collaboration field
  const renderCollaborationField = (field: FormField) => {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-3">{field.label || "Team Collaboration"}</h4>
        {field.text && <p className="text-sm text-blue-700 mb-4">{field.text}</p>}
        {!field.text && (
          <p className="text-sm text-blue-700 mb-4">
            Invite your team members to collaborate on this sprint. They will be able to view and contribute to tasks.
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
                Add or remove team members who can collaborate on your sprint.
              </DialogDescription>
            </DialogHeader>
            
            <CollaboratorsManagement />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // If there are no fields, return null
  if (!step.fields || step.fields.length === 0) {
    return <p className="text-gray-500">No form fields defined.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {step.fields.map((fieldData: FormField) => {
          const field = normalizeFieldType(fieldData);
          const fieldType = field.type || field.inputType;
          
          // Handle collaboration fields
          if (fieldType === 'collaboration' || field.id === 'invite_link') {
            return (
              <div key={field.id}>
                {renderCollaborationField(field)}
              </div>
            );
          }
          
          return (
            <div key={field.id} className="space-y-2">
              {field.label && <Label htmlFor={field.id}>{field.label}</Label>}
              
              {/* Render different input types based on field type */}
              {fieldType === 'text' && (
                <Input
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              )}
              
              {fieldType === 'textarea' && (
                <Textarea
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={4}
                />
              )}
              
              {fieldType === 'date' && (
                <Input
                  id={field.id}
                  type="date"
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              )}
              
              {fieldType === 'select' && field.options && (
                <Select
                  value={formValues[field.id] || ''}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
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
              )}
              
              {fieldType === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={formValues[field.id] || false}
                    onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                  />
                  <Label htmlFor={field.id} className="ml-2">{field.placeholder || ''}</Label>
                </div>
              )}
              
              {fieldType === 'boolean' && (
                <RadioGroup
                  value={formValues[field.id] === true ? 'true' : formValues[field.id] === false ? 'false' : ''}
                  onValueChange={(value) => handleFieldChange(field.id, value === 'true')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${field.id}-yes`} />
                    <Label htmlFor={`${field.id}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${field.id}-no`} />
                    <Label htmlFor={`${field.id}-no`}>No</Label>
                  </div>
                </RadioGroup>
              )}
              
              {fieldType === 'radio' && field.options && (
                <RadioGroup
                  value={formValues[field.id] || ''}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                >
                  {field.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                      <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {fieldType === 'multiselect' && field.options && (
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option.value}`}
                        checked={Array.isArray(formValues[field.id]) && formValues[field.id].includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = Array.isArray(formValues[field.id]) ? [...formValues[field.id]] : [];
                          if (checked) {
                            handleFieldChange(field.id, [...currentValues, option.value]);
                          } else {
                            handleFieldChange(
                              field.id,
                              currentValues.filter((val) => val !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
              
              {(fieldType === 'file' || fieldType === 'upload') && (
                <div className="mt-2">
                  <MultiFileUploader
                    existingFiles={Array.isArray(formValues[field.id]) ? formValues[field.id] : formValues[field.id] ? [formValues[field.id]] : []}
                    onFilesChange={(files) => handleMultiFileUpload(field.id, files)}
                    isCompleted={false}
                    maxFiles={5}
                  />
                </div>
              )}
              
              {fieldType === 'content' && renderContentField(field)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
