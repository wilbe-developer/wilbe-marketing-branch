
import React from "react";
import { StepNode } from "@/types/task-builder";
import { Card, CardContent } from "@/components/ui/card";

interface ContentStepRendererProps {
  step: StepNode;
}

export const ContentStepRenderer: React.FC<ContentStepRendererProps> = ({ step }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: step.text }} />
          {step.content && (
            <div dangerouslySetInnerHTML={{ __html: step.content }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
