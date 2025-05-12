
import React from "react";
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
}

export const WindowFormFields: React.FC<WindowFormFieldsProps> = ({
  window,
  values,
  onChange,
  onFileUpload,
  toggleMultiSelect,
  uploadedFile
}) => {
  // Determine if all required questions in this window are answered
  const areAllQuestionsAnswered = () => {
    for (const question of window.questions) {
      if (question.type === 'conditional') {
        if (question.conditional) {
          const conditionMet = question.conditional.some(cond => 
            values[cond.field] === cond.value
          );
          
          if (conditionMet && !values[question.id]) {
            return false;
          }
        }
      } else if (question.type !== 'file' && !values[question.id]) {
        return false;
      }
    }
    return true;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{window.title}</h2>
        <div className="space-y-6">
          {window.questions.map((question, index) => {
            // For conditional questions, check if we should render them
            if (question.type === 'conditional' && question.conditional) {
              // Check if any condition is met
              const shouldRender = question.conditional.some(cond => {
                return values[cond.field] === cond.value;
              });
              
              if (!shouldRender) {
                return null;
              }
            }
            
            return (
              <div key={question.id} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                {question.description && (
                  <p className="text-muted-foreground mb-2">{question.description}</p>
                )}
                <SprintFormField
                  step={question}
                  value={values[question.id]}
                  onChange={onChange}
                  onFileUpload={onFileUpload}
                  toggleMultiSelect={toggleMultiSelect}
                  uploadedFile={uploadedFile}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
