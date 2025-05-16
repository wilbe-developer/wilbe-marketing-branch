
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TaskDefinitionViewerProps {
  taskId: string;
  onEdit: () => void;
  onBack: () => void;
}

const TaskDefinitionViewer: React.FC<TaskDefinitionViewerProps> = ({ 
  taskId, 
  onEdit, 
  onBack 
}) => {
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
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
  }, [taskId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Task Details...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!task) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested task definition could not be found.</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button onClick={onEdit}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Steps ({task.steps.length})</TabsTrigger>
          <TabsTrigger value="flow">Flow Logic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Task Information</h3>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-2 font-medium">Title</td>
                        <td>{task.title}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Description</td>
                        <td>{task.description || "-"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Category</td>
                        <td>{task.category || "-"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Created</td>
                        <td>{new Date(task.created_at).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Last Updated</td>
                        <td>{new Date(task.updated_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Integration</h3>
                  {!task.profile_key ? (
                    <p className="text-gray-500">No profile integration configured.</p>
                  ) : (
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="py-2 font-medium">Profile Key</td>
                          <td>{task.profile_key}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Question</td>
                          <td>{task.profile_label || "-"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Type</td>
                          <td>{task.profile_type || "boolean"}</td>
                        </tr>
                        {task.profile_options && (
                          <tr>
                            <td className="py-2 font-medium">Options</td>
                            <td>
                              {task.profile_options.map((opt: any, i: number) => (
                                <div key={i} className="text-sm">
                                  {opt.label} ({opt.value})
                                </div>
                              ))}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="steps">
          <Card>
            <CardContent className="pt-6">
              <Accordion type="multiple" className="w-full">
                {task.steps.map((step: any, index: number) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">{index + 1}.</span>
                        <span className="mr-2 px-2 py-1 bg-gray-100 rounded text-xs uppercase">{step.type}</span>
                        <span className="truncate">{step.question || step.content || step.action || step.id}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <div className="pl-6 space-y-2">
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
                            <span className="font-semibold">Content:</span> 
                            {typeof step.content === 'string' ? (
                              <p>{step.content}</p>
                            ) : Array.isArray(step.content) ? (
                              <ul className="list-disc list-inside mt-1">
                                {step.content.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>Complex content</p>
                            )}
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
                            <span className="font-semibold">Options:</span>
                            <ul className="list-disc list-inside mt-1">
                              {step.options.map((option: any, i: number) => (
                                <li key={i}>{option.label} (value: {option.value})</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {step.profileDependencies && step.profileDependencies.length > 0 && (
                          <div>
                            <span className="font-semibold">Profile Dependencies:</span>
                            <ul className="list-disc list-inside mt-1">
                              {step.profileDependencies.map((dep: string, i: number) => (
                                <li key={i}>{dep}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {task.steps.length === 0 && (
                <p className="text-center text-gray-500 py-4">No steps defined for this task.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flow">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Conditional Flow</h3>
                  {(!task.conditional_flow || Object.keys(task.conditional_flow).length === 0) ? (
                    <p className="text-gray-500">No conditional flow logic defined.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>From Step</TableHead>
                          <TableHead>Answer</TableHead>
                          <TableHead>Next Step</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(task.conditional_flow).map(([stepIndex, conditions]: [string, any]) => 
                          Object.entries(conditions).map(([answer, nextStep]: [string, any], i) => (
                            <TableRow key={`${stepIndex}-${answer}-${i}`}>
                              <TableCell>
                                {Number(stepIndex) + 1}. {getStepName(task.steps[Number(stepIndex)])}
                              </TableCell>
                              <TableCell>
                                {answer === "*" ? "Any answer" : answer}
                              </TableCell>
                              <TableCell>
                                {Number(nextStep) + 1}. {getStepName(task.steps[Number(nextStep)])}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Answer Mapping</h3>
                  {(!task.answer_mapping || Object.keys(task.answer_mapping).length === 0) ? (
                    <p className="text-gray-500">No answer mapping defined.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Step</TableHead>
                          <TableHead>Database Key</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(task.answer_mapping).map(([stepIndex, key]: [string, any]) => (
                          <TableRow key={stepIndex}>
                            <TableCell>
                              {Number(stepIndex) + 1}. {getStepName(task.steps[Number(stepIndex)])}
                            </TableCell>
                            <TableCell>
                              {key}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function getStepName(step: any): string {
  if (!step) return "Unknown Step";
  return step.question || step.content || step.action || step.id;
}

export default TaskDefinitionViewer;
