
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface ConditionalFlowEditorProps {
  steps: any[];
  conditionalFlow: Record<string, any>;
  answerMapping: Record<string, string>;
  onFlowChange: (flow: Record<string, any>) => void;
  onMappingChange: (mapping: Record<string, string>) => void;
}

const ConditionalFlowEditor: React.FC<ConditionalFlowEditorProps> = ({
  steps,
  conditionalFlow,
  answerMapping,
  onFlowChange,
  onMappingChange
}) => {
  const [activeTab, setActiveTab] = useState("flow");

  const handleAddFlow = (stepIndex: number) => {
    const newFlow = { ...conditionalFlow };
    if (!newFlow[stepIndex]) {
      newFlow[stepIndex] = {};
    }
    newFlow[stepIndex]["*"] = 0; // Default to first step
    onFlowChange(newFlow);
  };

  const handleAddAnswerFlow = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step.options || step.options.length === 0) {
      toast.error("This step doesn't have predefined options");
      return;
    }
    
    const newFlow = { ...conditionalFlow };
    if (!newFlow[stepIndex]) {
      newFlow[stepIndex] = {};
    }
    
    // Add the first option value if not present
    const optionValue = step.options[0].value;
    if (!newFlow[stepIndex][optionValue]) {
      newFlow[stepIndex][optionValue] = 0; // Default to first step
    }
    
    onFlowChange(newFlow);
  };

  const handleChangeNextStep = (stepIndex: number, answer: string, nextStep: number) => {
    const newFlow = { ...conditionalFlow };
    if (!newFlow[stepIndex]) {
      newFlow[stepIndex] = {};
    }
    newFlow[stepIndex][answer] = nextStep;
    onFlowChange(newFlow);
  };

  const handleRemoveFlow = (stepIndex: number, answer: string) => {
    const newFlow = { ...conditionalFlow };
    if (newFlow[stepIndex]) {
      delete newFlow[stepIndex][answer];
      
      // If no more answers for this step, remove the step entry
      if (Object.keys(newFlow[stepIndex]).length === 0) {
        delete newFlow[stepIndex];
      }
    }
    onFlowChange(newFlow);
  };

  const handleAddMapping = (stepIndex: number) => {
    const newMapping = { ...answerMapping };
    newMapping[stepIndex] = "";
    onMappingChange(newMapping);
  };

  const handleChangeMapping = (stepIndex: number, key: string) => {
    const newMapping = { ...answerMapping };
    newMapping[stepIndex] = key;
    onMappingChange(newMapping);
  };

  const handleRemoveMapping = (stepIndex: number) => {
    const newMapping = { ...answerMapping };
    delete newMapping[stepIndex];
    onMappingChange(newMapping);
  };

  const getStepLabel = (index: number) => {
    if (index < 0 || index >= steps.length) return `Unknown step (${index})`;
    const step = steps[index];
    return `${index + 1}. ${step.question || step.content || step.action || step.id}`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="flow">Conditional Flow</TabsTrigger>
          <TabsTrigger value="mapping">Answer Mapping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flow">
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Define how answers to questions determine which step comes next. This creates branching paths through your task.
            </p>
            
            {steps.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">You need to add steps first before configuring flow</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const hasFlow = conditionalFlow[index];
                  const isQuestion = step.type === "question" && step.options && step.options.length > 0;
                  
                  return (
                    <Card key={index} className={hasFlow ? "border-blue-200" : ""}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="font-semibold">{index + 1}. {step.question || step.id}</span>
                            <p className="text-xs text-gray-500">{step.type}</p>
                          </div>
                          
                          {!hasFlow && (
                            <div className="space-x-2">
                              {isQuestion ? (
                                <Button size="sm" variant="outline" onClick={() => handleAddAnswerFlow(index)}>
                                  Add Option Flow
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleAddFlow(index)}>
                                  Add Default Flow
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {hasFlow && (
                          <div className="space-y-3">
                            {Object.entries(conditionalFlow[index]).map(([answer, nextStep]) => (
                              <div key={answer} className="flex items-center gap-2">
                                <div className="w-1/4">
                                  {answer === "*" ? (
                                    <span className="text-sm font-medium">Default (Any answer)</span>
                                  ) : (
                                    <Select value={answer} onValueChange={(value) => {
                                      // Add new answer and remove old one
                                      const newFlow = { ...conditionalFlow };
                                      newFlow[index][value] = nextStep;
                                      delete newFlow[index][answer];
                                      onFlowChange(newFlow);
                                    }}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select answer" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {step.options.map((option: any) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                        <SelectItem value="*">Any answer (*)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <Select 
                                    value={String(nextStep)} 
                                    onValueChange={(value) => handleChangeNextStep(index, answer, Number(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select next step" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {steps.map((s, i) => (
                                        <SelectItem key={i} value={String(i)}>
                                          {getStepLabel(i)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleRemoveFlow(index, answer)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                            
                            {isQuestion && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAddAnswerFlow(index)}
                                className="mt-2"
                              >
                                <Plus size={14} className="mr-1" /> Add Another Option
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mapping">
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Map step indices to semantic keys for storing answers in the database. This helps make your data more meaningful.
            </p>
            
            {steps.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">You need to add steps first before configuring answer mapping</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <Card key={index} className={answerMapping[index] ? "border-green-200" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="font-semibold">{index + 1}. {step.question || step.id}</span>
                          <p className="text-xs text-gray-500">{step.type}</p>
                        </div>
                        
                        {!answerMapping[index] ? (
                          <Button size="sm" variant="outline" onClick={() => handleAddMapping(index)}>
                            Add Mapping
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleRemoveMapping(index)}
                          >
                            <Trash2 size={14} className="mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                      
                      {answerMapping[index] && (
                        <div className="flex items-center gap-2">
                          <Label className="w-1/4">Database Key:</Label>
                          <Input
                            value={answerMapping[index]}
                            onChange={(e) => handleChangeMapping(index, e.target.value)}
                            placeholder="e.g., tto_conversation"
                            className="flex-1"
                          />
                        </div>
                      )}
                      
                      {!answerMapping[index] && (
                        <p className="text-xs text-gray-500">
                          Without mapping, answers will be stored with generic keys (step_0, step_1, etc.)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConditionalFlowEditor;
