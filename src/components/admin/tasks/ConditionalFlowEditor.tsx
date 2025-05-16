import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, HelpCircle, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onMappingChange,
}) => {
  const [sourceStep, setSourceStep] = useState<string>("");
  const [targetStep, setTargetStep] = useState<string>("");
  const [answerValue, setAnswerValue] = useState<string>("");
  const [customKey, setCustomKey] = useState<string>("");

  const questionSteps = steps.filter(step => step.type === "question");
  
  const addCondition = () => {
    if (!sourceStep || !targetStep) return;
    
    const stepIndex = steps.findIndex(s => s.id === sourceStep);
    if (stepIndex === -1) return;
    
    const targetIndex = steps.findIndex(s => s.id === targetStep);
    if (targetIndex === -1) return;
    
    const newFlow = { ...conditionalFlow };
    
    if (!newFlow[stepIndex]) {
      newFlow[stepIndex] = {};
    }
    
    // If answerValue is "*", it means this is a wildcard rule (match any answer)
    // Otherwise, it should match a specific answer value
    newFlow[stepIndex][answerValue || "*"] = targetIndex;
    
    onFlowChange(newFlow);
    
    // Reset inputs
    setAnswerValue("");
  };
  
  const removeCondition = (sourceIndex: number, answer: string) => {
    const newFlow = { ...conditionalFlow };
    
    if (newFlow[sourceIndex]) {
      delete newFlow[sourceIndex][answer];
      
      // If no more conditions for this step, remove the entry
      if (Object.keys(newFlow[sourceIndex]).length === 0) {
        delete newFlow[sourceIndex];
      }
    }
    
    onFlowChange(newFlow);
  };
  
  const addMapping = () => {
    if (!sourceStep || !customKey) return;
    
    const stepIndex = steps.findIndex(s => s.id === sourceStep);
    if (stepIndex === -1) return;
    
    const newMapping = { ...answerMapping };
    newMapping[stepIndex] = customKey;
    
    onMappingChange(newMapping);
    
    // Reset input
    setCustomKey("");
  };
  
  const removeMapping = (stepIndex: number) => {
    const newMapping = { ...answerMapping };
    delete newMapping[stepIndex];
    
    onMappingChange(newMapping);
  };

  const getStepName = (index: number) => {
    if (index >= 0 && index < steps.length) {
      const step = steps[index];
      return `Step ${index + 1}: ${step.question || step.content || step.action || step.id}`;
    }
    return `Step ${index + 1}`;
  };

  const getSourceStepOptions = (sourceStepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === sourceStepId);
    if (stepIndex === -1 || !steps[stepIndex].options) return [];
    
    return steps[stepIndex].options;
  };

  // Helper to ensure SelectItem always has a non-empty string value
  const ensureValidValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return 'default_value';
    return String(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span>Conditional Flow</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Conditional flow allows you to control which step is shown next based on the user's answer to a question.</p>
                  <p className="mt-2">For example, if user selects "Yes" to a question, you can show a different follow-up step than if they select "No".</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Question (If)</Label>
                <Select value={sourceStep} onValueChange={setSourceStep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source step" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionSteps.map((step, index) => (
                      <SelectItem key={step.id} value={ensureValidValue(step.id)}>
                        Step {steps.indexOf(step) + 1}: {step.question || step.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Answer Value</Label>
                <Select value={answerValue} onValueChange={setAnswerValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any answer (*) or specific value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Any answer (*)</SelectItem>
                    {getSourceStepOptions(sourceStep).map((option: any) => (
                      <SelectItem key={ensureValidValue(option.value)} value={ensureValidValue(option.value)}>
                        {option.label} ({ensureValidValue(option.value)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Target Step (Then)</Label>
                <Select value={targetStep} onValueChange={setTargetStep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target step" />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((step, index) => (
                      <SelectItem key={step.id} value={ensureValidValue(step.id)}>
                        Step {index + 1}: {step.question || step.content || step.action || step.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={addCondition} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add Condition
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 mt-4">
              <h3 className="font-medium mb-2">Current Flow Rules</h3>
              
              {Object.keys(conditionalFlow).length === 0 ? (
                <p className="text-sm text-gray-500">No conditional flow rules defined yet. By default, steps are shown in sequence.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(conditionalFlow).map(([sourceIndex, answers]) => (
                    <div key={sourceIndex} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <div className="font-medium">{getStepName(Number(sourceIndex))}</div>
                      <div className="ml-4 mt-1 space-y-1">
                        {Object.entries(answers as Record<string, number>).map(([answer, targetIndex]) => (
                          <div key={answer} className="flex items-center text-sm">
                            <div className="flex-1 flex items-center">
                              <span className="mr-2">If answer is</span>
                              <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">
                                {answer === "*" ? "any value (*)" : answer}
                              </span>
                              <ArrowRight size={14} className="mx-2" />
                              <span>go to</span>
                              <span className="ml-2 font-medium">{getStepName(targetIndex)}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCondition(Number(sourceIndex), answer)}
                              className="ml-2"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span>Answer Mapping</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Answer mapping allows you to create meaningful keys for storing answers in the database.</p>
                  <p className="mt-2">For example, instead of storing data as "step_0", you can map it to "university_ip_status".</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Step</Label>
                <Select value={sourceStep} onValueChange={setSourceStep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select step" />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((step, index) => (
                      <SelectItem key={step.id} value={ensureValidValue(step.id)}>
                        Step {index + 1}: {step.question || step.content || step.action || step.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Database Key</Label>
                <Input
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="e.g., company_reason"
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={addMapping} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add Mapping
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 mt-4">
              <h3 className="font-medium mb-2">Current Mappings</h3>
              
              {Object.keys(answerMapping).length === 0 ? (
                <p className="text-sm text-gray-500">No answer mappings defined yet. By default, answers will be stored with generic step_X keys.</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(answerMapping).map(([stepIndex, key]) => (
                    <div key={stepIndex} className="flex items-center justify-between text-sm py-1">
                      <div>
                        <span>{getStepName(Number(stepIndex))}</span>
                        <span className="mx-2">→</span>
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded">{key}</code>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeMapping(Number(stepIndex))}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConditionalFlowEditor;
