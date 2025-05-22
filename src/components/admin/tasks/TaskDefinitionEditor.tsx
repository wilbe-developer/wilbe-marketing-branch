import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveAll, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StepEditor from "./StepEditor";
import ConditionalFlowEditor from "./ConditionalFlowEditor";
import TaskProfileIntegration, { ProfileSettings } from "./TaskProfileIntegration";

interface TaskDefinitionEditorProps {
  taskId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface TaskDefinition {
  id?: string;
  title: string;
  description: string;
  category: string;
  profile_key: string;
  profile_label: string;
  profile_type: "boolean" | "text" | "select" | "multi-select";
  profile_options: any;
  steps: any[];
  conditional_flow: Record<string, any>;
  answer_mapping: Record<string, string>;
}

const defaultTask: TaskDefinition = {
  title: "",
  description: "",
  category: "",
  profile_key: "",
  profile_label: "",
  profile_type: "boolean",
  profile_options: null,
  steps: [],
  conditional_flow: {},
  answer_mapping: {}
};

const TaskDefinitionEditor: React.FC<TaskDefinitionEditorProps> = ({ 
  taskId, 
  onSaved, 
  onCancel 
}) => {
  const [task, setTask] = useState<TaskDefinition>(defaultTask);
  const [isLoading, setIsLoading] = useState(taskId ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch task if editing
  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        setIsLoading(true);
        
        try {
          const { data, error } = await supabase
            .from("task_definitions")
            .select("*")
            .eq("id", taskId)
            .single();
            
          if (error) {
            throw error;
          }
          
          // Parse JSON fields
          const parsedData = {
            ...data,
            steps: typeof data.steps === 'string' ? JSON.parse(data.steps) : data.steps,
            conditional_flow: data.conditional_flow ? 
              (typeof data.conditional_flow === 'string' ? JSON.parse(data.conditional_flow) : data.conditional_flow) : 
              {},
            answer_mapping: data.answer_mapping ? 
              (typeof data.answer_mapping === 'string' ? JSON.parse(data.answer_mapping) : data.answer_mapping) : 
              {},
            profile_options: data.profile_options ? 
              (typeof data.profile_options === 'string' ? JSON.parse(data.profile_options) : data.profile_options) : 
              null
          };
          
          setTask(parsedData);
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Failed to load task definition");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTask();
    }
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setTask({
      ...task,
      [field]: value
    });
  };

  const updateSteps = (steps: any[]) => {
    setTask({
      ...task,
      steps
    });
  };

  const updateConditionalFlow = (flow: Record<string, any>) => {
    setTask({
      ...task,
      conditional_flow: flow
    });
  };

  const updateAnswerMapping = (mapping: Record<string, string>) => {
    setTask({
      ...task,
      answer_mapping: mapping
    });
  };

  const updateProfileSettings = (settings: ProfileSettings) => {
    setTask({
      ...task,
      profile_key: settings.profile_key,
      profile_label: settings.profile_label,
      profile_type: settings.profile_type,
      profile_options: settings.profile_options
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!task.title) {
      toast.error("Task title is required");
      return;
    }
    
    if (task.steps.length === 0) {
      toast.error("Task must have at least one step");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare data for saving
      const taskData = {
        ...task,
        steps: JSON.stringify(task.steps),
        conditional_flow: Object.keys(task.conditional_flow).length > 0 ? 
          JSON.stringify(task.conditional_flow) : 
          null,
        answer_mapping: Object.keys(task.answer_mapping).length > 0 ? 
          JSON.stringify(task.answer_mapping) : 
          null,
        profile_options: task.profile_options ? 
          JSON.stringify(task.profile_options) : 
          null
      };
      
      let result;
      
      if (taskId) {
        // Update existing task
        result = await supabase
          .from("task_definitions")
          .update(taskData)
          .eq("id", taskId);
      } else {
        // Create new task
        result = await supabase
          .from("task_definitions")
          .insert(taskData);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success(taskId ? "Task definition updated" : "Task definition created");
      onSaved();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task definition");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Task Definition...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{taskId ? "Edit Task Definition" : "Create New Task Definition"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="profile">Profile Integration</TabsTrigger>
              <TabsTrigger value="steps">Task Steps</TabsTrigger>
              <TabsTrigger value="flow">Conditional Flow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={task.description || ""}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={task.category || ""} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="ip">Intellectual Property</SelectItem>
                    <SelectItem value="market">Market Research</SelectItem>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="product">Product Development</SelectItem>
                    <SelectItem value="incorporation">Incorporation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <TaskProfileIntegration
                profileSettings={{
                  profile_key: task.profile_key,
                  profile_label: task.profile_label,
                  profile_type: task.profile_type,
                  profile_options: task.profile_options
                }}
                onChange={updateProfileSettings}
              />
            </TabsContent>
            
            <TabsContent value="steps">
              <StepEditor
                steps={task.steps}
                onChange={updateSteps}
              />
            </TabsContent>
            
            <TabsContent value="flow">
              <ConditionalFlowEditor
                steps={task.steps}
                conditionalFlow={task.conditional_flow}
                answerMapping={task.answer_mapping}
                onFlowChange={updateConditionalFlow}
                onMappingChange={updateAnswerMapping}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <SaveAll size={16} className="mr-2" />
              Save Task Definition
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskDefinitionEditor;
