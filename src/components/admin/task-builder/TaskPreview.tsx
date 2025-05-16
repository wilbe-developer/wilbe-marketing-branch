
import React, { useState } from "react";
import { TaskDefinition, StepNode } from "@/types/task-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EyeIcon, Code } from "lucide-react";
import DynamicTaskRenderer from "./DynamicTaskRenderer";

interface TaskPreviewProps {
  taskDefinition: TaskDefinition;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ taskDefinition }) => {
  const [showJson, setShowJson] = useState(false);
  const [profileAnswers, setProfileAnswers] = useState<Record<string, any>>({});
  const [stepAnswers, setStepAnswers] = useState<Record<string, any>>({});

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const handleProfileAnswerChange = (key: string, value: any) => {
    setProfileAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStepAnswerChange = (stepId: string, value: any) => {
    setStepAnswers((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const renderJsonView = () => (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Task Definition JSON</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowJson(false)}
        >
          <EyeIcon size={16} className="mr-2" />
          Show Preview
        </Button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
        {formatJson(taskDefinition)}
      </pre>
    </div>
  );

  const renderPreviewView = () => (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Task Preview</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowJson(true)}
        >
          <Code size={16} className="mr-2" />
          Show JSON
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicTaskRenderer
                taskDefinition={taskDefinition}
                profileAnswers={profileAnswers}
                stepAnswers={stepAnswers}
                onProfileAnswerChange={handleProfileAnswerChange}
                onStepAnswerChange={handleStepAnswerChange}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="profile">
            <AccordionItem value="profile">
              <AccordionTrigger>Profile Answers</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                  {formatJson(profileAnswers)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="steps">
              <AccordionTrigger>Step Answers</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                  {formatJson(stepAnswers)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );

  return <div>{showJson ? renderJsonView() : renderPreviewView()}</div>;
};

export default TaskPreview;
