import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSprintTaskDefinitions } from "@/hooks/task-builder/useSprintTaskDefinitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, SaveAll } from "lucide-react";
import { toast } from "sonner";
import { TaskDefinition } from "@/types/task-builder";

interface TaskEditorProps {
  taskId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface FormData {
  taskName: string;
  description?: string;
  category: string;
}

const SimplifiedTaskEditor = ({ taskId, onSaved, onCancel }: TaskEditorProps) => {
  const navigate = useNavigate();
  const { updateTaskDefinition, createTaskDefinition } = useSprintTaskDefinitions();
  const [formData, setFormData] = useState<FormData>({
    taskName: "",
    description: "",
    category: "",
  });
  const [steps, setSteps] = useState<any[]>([]); // Simplified, replace with actual step editor later
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (taskId) {
      // Fetch existing task data and populate form
      // In this simplified example, we'll just set a default task name
      setFormData((prev) => ({ ...prev, taskName: "Existing Task", category: "other" }));
    }
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSave = async () => {
    if (!formData || !formData.taskName || !formData.category) {
      toast.error("Task name and category are required");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const taskDefinition: TaskDefinition = {
        taskName: formData.taskName,
        description: formData.description || '',
        category: formData.category,
        steps: steps,
        profileQuestions: [],
        staticPanels: []
      };
      
      if (taskId) {
        updateTaskDefinition.mutate({
          id: taskId,
          name: formData.taskName,
          description: formData.description || '',
          definition: taskDefinition
        }, {
          onSuccess: () => {
            toast.success("Task updated successfully");
            onSaved();
          },
          onError: (error) => {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
          }
        });
      } else {
        createTaskDefinition.mutate({
          id: '',
          name: formData.taskName,
          description: formData.description || '',
          definition: taskDefinition,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onSuccess: () => {
            toast.success("Task created successfully");
            onSaved();
          },
          onError: (error) => {
            console.error("Error creating task:", error);
            toast.error("Failed to create task");
          }
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/task-builder")}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold">
            {taskId ? "Edit Task" : "Create Task"}
          </h2>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <SaveAll size={16} className="mr-2" />
              Save Task
            </>
          )}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              placeholder="Enter task name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange} defaultValue={formData.category}>
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
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
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
              Save Task
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedTaskEditor;
