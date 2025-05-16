
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface StepEditorProps {
  steps: any[];
  onChange: (steps: any[]) => void;
}

const StepEditor: React.FC<StepEditorProps> = ({ steps, onChange }) => {
  const [editingStep, setEditingStep] = useState<any | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: "question",
      question: "",
      content: "",
      context: "",
      profileDependencies: []
    };
    
    setEditingStep(newStep);
    setEditingIndex(steps.length);
  };

  const handleEditStep = (step: any, index: number) => {
    setEditingStep({ ...step });
    setEditingIndex(index);
  };

  const handleDeleteStep = (index: number) => {
    if (confirm("Are you sure you want to delete this step?")) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      onChange(newSteps);
      toast.success("Step deleted");
    }
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
      onChange(newSteps);
    } else if (direction === "down" && index < steps.length - 1) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      onChange(newSteps);
    }
  };

  const handleSaveStep = () => {
    if (!editingStep) return;
    
    // Validate step
    if (!editingStep.id) {
      toast.error("Step ID is required");
      return;
    }
    
    // Validate options to ensure no empty values
    if (editingStep.options && editingStep.options.length > 0) {
      const hasEmptyValues = editingStep.options.some(
        (option: any) => option.value === ""
      );
      
      if (hasEmptyValues) {
        toast.error("Option values cannot be empty");
        return;
      }
    }
    
    const newSteps = [...steps];
    
    if (editingIndex !== null) {
      if (editingIndex >= steps.length) {
        newSteps.push(editingStep);
      } else {
        newSteps[editingIndex] = editingStep;
      }
    }
    
    onChange(newSteps);
    setEditingStep(null);
    setEditingIndex(null);
    toast.success("Step saved");
  };

  const handleStepChange = (field: string, value: any) => {
    if (!editingStep) return;
    
    setEditingStep({
      ...editingStep,
      [field]: value
    });
  };

  const handleAddOption = () => {
    if (!editingStep) return;
    
    setEditingStep({
      ...editingStep,
      options: [...(editingStep.options || []), { label: "", value: "option-" + Date.now() }]
    });
  };

  const handleUpdateOption = (index: number, field: "label" | "value", value: string) => {
    if (!editingStep || !editingStep.options) return;
    
    const newOptions = [...editingStep.options];
    // Ensure value is never empty
    if (field === "value" && value === "") {
      value = "option-" + Date.now();
    }
    
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    setEditingStep({
      ...editingStep,
      options: newOptions
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!editingStep || !editingStep.options) return;
    
    const newOptions = [...editingStep.options];
    newOptions.splice(index, 1);
    
    setEditingStep({
      ...editingStep,
      options: newOptions
    });
  };

  const handleAddProfileDependency = () => {
    if (!editingStep) return;
    
    setEditingStep({
      ...editingStep,
      profileDependencies: [...(editingStep.profileDependencies || []), ""]
    });
  };

  const handleUpdateProfileDependency = (index: number, value: string) => {
    if (!editingStep || !editingStep.profileDependencies) return;
    
    const newDependencies = [...editingStep.profileDependencies];
    newDependencies[index] = value;
    
    setEditingStep({
      ...editingStep,
      profileDependencies: newDependencies
    });
  };

  const handleRemoveProfileDependency = (index: number) => {
    if (!editingStep || !editingStep.profileDependencies) return;
    
    const newDependencies = [...editingStep.profileDependencies];
    newDependencies.splice(index, 1);
    
    setEditingStep({
      ...editingStep,
      profileDependencies: newDependencies
    });
  };

  return (
    <div className="space-y-6">
      {steps.length === 0 && !editingStep && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No steps defined yet</p>
          <Button onClick={handleAddStep}>Add First Step</Button>
        </div>
      )}
      
      {steps.length > 0 && !editingStep && (
        <div className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {steps.map((step, index) => (
              <AccordionItem key={step.id} value={step.id}>
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span className="mr-2 px-2 py-1 bg-gray-100 rounded text-xs uppercase">{step.type}</span>
                      <span className="truncate">{step.question || step.content || step.action || step.id}</span>
                    </div>
                  </AccordionTrigger>
                  <div className="flex gap-1 mr-4">
                    <Button variant="ghost" size="icon" onClick={() => handleMoveStep(index, "up")} disabled={index === 0}>
                      <ChevronUp size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMoveStep(index, "down")} disabled={index === steps.length - 1}>
                      <ChevronDown size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditStep(step, index)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStep(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <AccordionContent>
                  <div className="pl-6 pt-2 space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">ID:</span> {step.id}
                    </div>
                    {step.question && (
                      <div>
                        <span className="font-semibold">Question:</span> {step.question}
                      </div>
                    )}
                    {step.content && (
                      <div>
                        <span className="font-semibold">Content:</span> {typeof step.content === 'string' ? step.content : 'Complex content (multiple items)'}
                      </div>
                    )}
                    {step.action && (
                      <div>
                        <span className="font-semibold">Action:</span> {step.action}
                      </div>
                    )}
                    {step.context && (
                      <div>
                        <span className="font-semibold">Context:</span> {step.context}
                      </div>
                    )}
                    {step.options && step.options.length > 0 && (
                      <div>
                        <span className="font-semibold">Options:</span> {step.options.map((o: any) => o.label).join(', ')}
                      </div>
                    )}
                    {step.profileDependencies && step.profileDependencies.length > 0 && (
                      <div>
                        <span className="font-semibold">Profile Dependencies:</span> {step.profileDependencies.join(', ')}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="flex justify-end">
            <Button onClick={handleAddStep} variant="outline">
              <Plus size={16} className="mr-2" />
              Add Step
            </Button>
          </div>
        </div>
      )}
      
      {editingStep && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="step-id">Step ID</Label>
                  <Input
                    id="step-id"
                    value={editingStep.id || ""}
                    onChange={(e) => handleStepChange("id", e.target.value)}
                    placeholder="unique-step-id"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step-type">Step Type</Label>
                  <Select 
                    value={editingStep.type} 
                    onValueChange={(value) => handleStepChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select step type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="upload">File Upload</SelectItem>
                      <SelectItem value="form">Custom Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(editingStep.type === "question") && (
                <div className="space-y-2">
                  <Label htmlFor="step-question">Question</Label>
                  <Input
                    id="step-question"
                    value={editingStep.question || ""}
                    onChange={(e) => handleStepChange("question", e.target.value)}
                    placeholder="Enter question text"
                  />
                </div>
              )}
              
              {(editingStep.type === "question" || editingStep.type === "content") && (
                <div className="space-y-2">
                  <Label htmlFor="step-content">Content/Description</Label>
                  <Textarea
                    id="step-content"
                    value={typeof editingStep.content === 'string' ? editingStep.content : (Array.isArray(editingStep.content) ? editingStep.content.join('\n') : '')}
                    onChange={(e) => handleStepChange("content", e.target.value)}
                    placeholder="Enter content or description"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">For content steps, use this field for the main content. For multi-line content, each line will be treated as a separate item.</p>
                </div>
              )}
              
              {editingStep.type === "upload" && (
                <div className="space-y-2">
                  <Label htmlFor="step-action">Upload Action Text</Label>
                  <Input
                    id="step-action"
                    value={editingStep.action || ""}
                    onChange={(e) => handleStepChange("action", e.target.value)}
                    placeholder="e.g., Upload your document"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="step-context">Context</Label>
                <Select 
                  value={editingStep.context || ""} 
                  onValueChange={(value) => handleStepChange("context", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select context (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="ip">Intellectual Property</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="company_reason">Company Reason</SelectItem>
                    <SelectItem value="incorporation">Incorporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {editingStep.type === "question" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Answer Options</Label>
                    <Button size="sm" variant="outline" onClick={handleAddOption}>
                      <Plus size={14} className="mr-1" /> Add Option
                    </Button>
                  </div>
                  
                  {(!editingStep.options || editingStep.options.length === 0) && (
                    <p className="text-xs text-gray-500">No options defined. If left empty, this will be a free-text question.</p>
                  )}
                  
                  {editingStep.options && editingStep.options.map((option: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={option.label || ""}
                        onChange={(e) => handleUpdateOption(index, "label", e.target.value)}
                        placeholder="Option label"
                        className="flex-1"
                      />
                      <Input
                        value={option.value || ""}
                        onChange={(e) => handleUpdateOption(index, "value", e.target.value)}
                        placeholder="Value"
                        className="w-1/3"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Profile Dependencies</Label>
                  <Button size="sm" variant="outline" onClick={handleAddProfileDependency}>
                    <Plus size={14} className="mr-1" /> Add Dependency
                  </Button>
                </div>
                
                {(!editingStep.profileDependencies || editingStep.profileDependencies.length === 0) && (
                  <p className="text-xs text-gray-500">No profile dependencies. This step will always be shown.</p>
                )}
                
                {editingStep.profileDependencies && editingStep.profileDependencies.map((dependency: string, index: number) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={dependency}
                      onChange={(e) => handleUpdateProfileDependency(index, e.target.value)}
                      placeholder="e.g., university_ip=true"
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveProfileDependency(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-gray-500">Format: field_name=value (e.g., university_ip=true) or just field_name to check if it exists</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
                setEditingStep(null);
                setEditingIndex(null);
              }}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveStep}>
                <Save size={16} className="mr-2" />
                Save Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepEditor;
