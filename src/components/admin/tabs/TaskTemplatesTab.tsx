
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Copy, FilePlus, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  steps: any[];
}

const TaskTemplatesTab = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch templates from a database
      // For now, we'll use some mock data
      setTemplates([
        {
          id: 'ip-template',
          name: 'IP Assessment Template',
          description: 'A comprehensive assessment for intellectual property strategy',
          steps: [
            { id: 'step1', title: 'IP Overview', type: 'content' },
            { id: 'step2', title: 'Patent Status', type: 'question' },
            { id: 'step3', title: 'IP Protection Strategy', type: 'question' }
          ]
        },
        {
          id: 'team-template',
          name: 'Team Assessment Template',
          description: 'Evaluate team composition and roles',
          steps: [
            { id: 'step1', title: 'Team Overview', type: 'content' },
            { id: 'step2', title: 'Co-founder Information', type: 'question' },
            { id: 'step3', title: 'Skills Assessment', type: 'question' }
          ]
        },
        {
          id: 'market-template',
          name: 'Market Research Template',
          description: 'Analyze market size and competition',
          steps: [
            { id: 'step1', title: 'Market Overview', type: 'content' },
            { id: 'step2', title: 'Competitor Analysis', type: 'question' },
            { id: 'step3', title: 'Market Size Estimation', type: 'question' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const createFromTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        toast.error('Template not found');
        return;
      }

      toast.success(`Created task from template: ${template.name}`);
      
      // In a real app, this would create a new task definition in the database
      // For now, we'll just show a success toast
    } catch (error) {
      console.error('Error creating from template:', error);
      toast.error('Failed to create from template');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-primary" />
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <div className="text-xs text-gray-500 mb-4">
                {template.steps.length} steps included
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => createFromTemplate(template.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="overflow-hidden border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <FilePlus className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Create Custom Template</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Design your own template for reuse
            </p>
            <Button variant="outline">
              Create Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskTemplatesTab;
