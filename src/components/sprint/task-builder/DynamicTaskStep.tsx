
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface DynamicTaskStepProps {
  step: StepNode;
  answer: any;
  onAnswer: (value: any) => void;
  onFileUpload: (file: File) => void;
}

const DynamicTaskStep: React.FC<DynamicTaskStepProps> = ({
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

  switch (step.type) {
    case "question":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              {renderQuestionInput()}
            </div>
          </CardContent>
        </Card>
      );

    case "content":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: step.text }} />
            </div>
          </CardContent>
        </Card>
      );

    case "file":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
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
                      {fileUploadState.uploading
                        ? "Uploading..."
                        : "Select File"}
                    </label>
                  </div>

                  {fileUploadState.file && !fileUploadState.uploading && !answer && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {fileUploadState.file.name}
                    </p>
                  )}

                  {fileUploadState.error && (
                    <p className="mt-2 text-sm text-red-500">
                      {fileUploadState.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );

    case "exercise":
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{step.text}</h3>
              <Textarea
                value={answer || ""}
                onChange={(e) => onAnswer(e.target.value)}
                placeholder="Enter your answer here..."
                rows={6}
              />
              <Button onClick={() => onAnswer(answer || "")}>Save Answer</Button>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500">Unknown step type: {step.type}</div>
          </CardContent>
        </Card>
      );
  }

  function renderQuestionInput() {
    if (!step.inputType) return null;

    switch (step.inputType) {
      case "radio":
        return (
          <RadioGroup
            value={answer || ""}
            onValueChange={onAnswer}
          >
            <div className="space-y-2">
              {step.options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${step.id}-${option.value}`}
                  />
                  <Label htmlFor={`${step.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case "boolean":
        return (
          <RadioGroup
            value={answer?.toString() || ""}
            onValueChange={(value) => onAnswer(value === "true")}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${step.id}-true`} />
                <Label htmlFor={`${step.id}-true`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${step.id}-false`} />
                <Label htmlFor={`${step.id}-false`}>No</Label>
              </div>
            </div>
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={answer || ""}
            onValueChange={onAnswer}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {step.options?.map((option, i) => (
                <SelectItem key={i} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {step.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${step.id}-${option.value}`}
                  checked={Array.isArray(answer) && answer.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(answer) ? [...answer] : [];
                    if (checked) {
                      onAnswer([...currentValues, option.value]);
                    } else {
                      onAnswer(
                        currentValues.filter((val) => val !== option.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${step.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Textarea
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer..."
              rows={4}
            />
            <Button onClick={() => onAnswer(answer || "")}>Save Answer</Button>
          </div>
        );

      case "text":
      default:
        return (
          <div className="space-y-2">
            <Input
              value={answer || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer..."
            />
            <Button onClick={() => onAnswer(answer || "")}>Save Answer</Button>
          </div>
        );
    }
  }
};

export default DynamicTaskStep;
