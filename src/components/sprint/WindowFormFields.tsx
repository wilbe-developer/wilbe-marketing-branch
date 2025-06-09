
import React, { useState } from "react";
import { Window } from "@/types/sprint-signup";
import { Card, CardContent } from "@/components/ui/card";
import { SprintFormField } from "./SprintFormField";

interface WindowFormFieldsProps {
  window: Window;
  values: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (file: File | null) => void;
  toggleMultiSelect: (field: string, value: string) => void;
  uploadedFile: File | null;
  validationErrors?: Record<string, string>;
  onValidationChange?: (field: string, isValid: boolean, canonicalValue?: string) => void;
}

export const WindowFormFields: React.FC<WindowFormFieldsProps> = ({
  window,
  values,
  onChange,
  onFileUpload,
  toggleMultiSelect,
  uploadedFile,
  validationErrors = {},
  onValidationChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{window.title}</h2>
        <div className="space-y-6">
          {window.questions.map((question, index) => {
            // For conditional questions, check if we should render them
            if (question.type === 'conditional' && question.conditional) {
              const shouldRender = question.conditional.some(cond => {
                return values[cond.field] === cond.value;
              });
              
              if (!shouldRender) {
                return null;
              }
            }
            
            return (
              <div key={question.id} className="mb-4">
                {question.type !== 'checkbox' || question.options ? (
                  <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                ) : null}
                {question.description && (
                  <p className="text-muted-foreground mb-2">{question.description}</p>
                )}
                <SprintFormField
                  step={question}
                  value={values[question.id]}
                  formValues={values}
                  onChange={onChange}
                  onFileUpload={onFileUpload}
                  toggleMultiSelect={toggleMultiSelect}
                  uploadedFile={uploadedFile}
                  validationErrors={validationErrors}
                  onValidationChange={onValidationChange}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
