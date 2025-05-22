import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSprintTaskDefinitions } from '@/hooks/task-builder/useSprintTaskDefinitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SaveAll, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  steps: TaskStep[];
}

interface TaskStep {
  id: string;
  type: string;
  text: string;
  inputType: string;
}

const SimplifiedTaskEditor: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { fetchTaskDefinition, updateTaskDefinition, createTaskDefinition } = useSprintTaskDefinitions();

  const [task, setTask] = useState<TaskDefinition | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        const taskData = await fetchTaskDefinition(taskId);
        if (taskData) {
          setTask({
            id: taskData.id,
            name: taskData.name,
            description: taskData.description || '',
            steps: taskData.definition.steps.map((step: any) => ({
              id: step.id,
              type: step.type,
              text: step.text,
              inputType: step.inputType
            }))
          });
        }
      } else {
        setTask({
          id: '',
          name: '',
          description: '',
          steps: [{ id: '1', type: 'question', text: 'First Question', inputType: 'text' }]
        });
      }
    };

    loadTask();
  }, [taskId, fetchTaskDefinition]);

  const handleAddStep = () => {
    if (!task) return;
    const newStepId = String(task.steps.length + 1);
    setTask({
      ...task,
      steps: [...task.steps, { id: newStepId, type: 'question', text: `Question ${newStepId}`, inputType: 'text' }]
    });
  };

  const handleRemoveStep = (index: number) => {
    if (!task) return;
    const newSteps = [...task.steps];
    newSteps.splice(index, 1);
    setTask({ ...task, steps: newSteps });
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    if (!task) return;
    const newSteps = [...task.steps];
    newSteps[index][field] = value;
    setTask({ ...task, steps: newSteps });
  };

  const handleSave = async () => {
    if (!task) return;
    
    if (!task.name.trim()) {
      toast.error('Task name is required');
      return;
    }
    
    if (task.steps.length === 0) {
      toast.error('At least one step is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Saving task:', task);
      
      const taskToSave = {
        id: task.id,
        name: task.name,
        description: task.description,
        definition: {
          taskName: task.name,
          description: task.description,
          steps: task.steps.map(step => ({
            id: step.id,
            type: step.type,
            text: step.text,
            inputType: step.inputType
          }))
        }
      };
      
      if (taskId) {
        // Update existing task
        await updateTaskDefinition(taskToSave);
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const result = await createTaskDefinition(taskToSave);
        toast.success('Task created successfully');
        navigate(`/admin/task-builder/edit-simple/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/task-builder')} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold">{taskId ? 'Edit Task Definition' : 'Create Task Definition'}</h2>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
          <CardTitle>
            <Input
              type="text"
              placeholder="Task Name"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Task Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <h3 className="text-xl font-semibold">Steps</h3>
          {task.steps.map((step, index) => (
            <div key={step.id} className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor={`step-${step.id}-text`}>Step {index + 1}</Label>
              <Input
                type="text"
                id={`step-${step.id}-text`}
                placeholder="Step Text"
                value={step.text}
                onChange={(e) => handleStepChange(index, 'text', e.target.value)}
              />
              <select value={step.type} onChange={(e) => handleStepChange(index, 'type', e.target.value)}>
                <option value="question">Question</option>
                <option value="content">Content</option>
              </select>
              <select value={step.inputType} onChange={(e) => handleStepChange(index, 'inputType', e.target.value)}>
                <option value="text">Text</option>
                <option value="boolean">Boolean</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => handleRemoveStep(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddStep}>
            Add Step
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedTaskEditor;
