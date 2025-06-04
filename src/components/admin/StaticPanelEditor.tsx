
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StaticPanel } from '@/types/task-builder';
import { EditablePanel } from './EditablePanel';
import { useStaticPanelMutation } from '@/hooks/useStaticPanelMutation';

interface StaticPanelEditorProps {
  taskId: string;
  panels: StaticPanel[];
  isAdmin: boolean;
}

export const StaticPanelEditor: React.FC<StaticPanelEditorProps> = ({
  taskId,
  panels,
  isAdmin
}) => {
  const [localPanels, setLocalPanels] = useState<StaticPanel[]>(panels);
  const { updateStaticPanels } = useStaticPanelMutation();

  const addNewPanel = () => {
    const newPanel: StaticPanel = {
      id: `panel_${Date.now()}`,
      title: "New Panel",
      content: "",
      type: "info",
      items: []
    };
    setLocalPanels([...localPanels, newPanel]);
  };

  const updatePanel = (index: number, updatedPanel: StaticPanel) => {
    const updatedPanels = localPanels.map((panel, i) => 
      i === index ? updatedPanel : panel
    );
    setLocalPanels(updatedPanels);
  };

  const removePanel = (index: number) => {
    const updatedPanels = localPanels.filter((_, i) => i !== index);
    setLocalPanels(updatedPanels);
  };

  const saveAllPanels = () => {
    updateStaticPanels.mutate({
      taskId,
      staticPanels: localPanels
    });
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        {panels.map((panel, index) => (
          <EditablePanel
            key={index}
            panel={panel}
            onSave={() => {}}
            isAdmin={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Static Panels</h3>
        <div className="flex gap-2">
          <Button onClick={addNewPanel} variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Panel
          </Button>
          <Button 
            onClick={saveAllPanels}
            disabled={updateStaticPanels.isPending}
          >
            {updateStaticPanels.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {localPanels.map((panel, index) => (
          <div key={index} className="relative">
            <EditablePanel
              panel={panel}
              onSave={(updatedPanel) => updatePanel(index, updatedPanel)}
              isAdmin={true}
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-12"
              onClick={() => removePanel(index)}
            >
              Remove Panel
            </Button>
          </div>
        ))}
      </div>
      
      {localPanels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No static panels yet. Click "Add Panel" to create one.
        </div>
      )}
    </div>
  );
};
