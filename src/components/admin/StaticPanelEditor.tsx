
import React from 'react';
import { StaticPanel } from '@/types/task-builder';
import EditablePanel from './EditablePanel';

interface StaticPanelEditorProps {
  panels: StaticPanel[];
  taskId: string;
  editingPanelIndex: number | null;
  onStartEdit: (index: number) => void;
  onStopEdit: () => void;
}

const StaticPanelEditor: React.FC<StaticPanelEditorProps> = ({
  panels,
  taskId,
  editingPanelIndex,
  onStartEdit,
  onStopEdit
}) => {
  if (editingPanelIndex === null) {
    return null;
  }

  const panel = panels[editingPanelIndex];
  if (!panel) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <EditablePanel
          panel={panel}
          panelIndex={editingPanelIndex}
          taskId={taskId}
          onSave={onStopEdit}
          onCancel={onStopEdit}
        />
      </div>
    </div>
  );
};

export default StaticPanelEditor;
