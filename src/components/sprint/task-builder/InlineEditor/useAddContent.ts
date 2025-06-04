
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StaticPanel, StaticPanelItem } from '@/types/task-builder';

interface AddContentState {
  type: 'item' | 'collapsible-item' | 'content' | 'panel' | null;
  panelId?: string;
  itemIndex?: number;
}

export const useAddContent = () => {
  const [addingContent, setAddingContent] = useState<AddContentState>({ type: null });

  const startAddingItem = (panelId: string) => {
    setAddingContent({ type: 'item', panelId });
  };

  const startAddingCollapsibleItem = (panelId: string) => {
    setAddingContent({ type: 'collapsible-item', panelId });
  };

  const startAddingContent = (panelId: string) => {
    setAddingContent({ type: 'content', panelId });
  };

  const startAddingPanel = () => {
    setAddingContent({ type: 'panel' });
  };

  const cancelAdding = () => {
    setAddingContent({ type: null });
  };

  const createNewItem = (isExpandable: boolean = false): StaticPanelItem => {
    return {
      text: isExpandable ? "New collapsible item" : "New item",
      order: 1, // Will be adjusted based on existing items
      isExpandable,
      expandedContent: isExpandable ? "Expanded content goes here..." : undefined
    };
  };

  const createNewPanel = (): StaticPanel => {
    return {
      id: uuidv4(),
      title: "New Panel",
      items: [{
        text: "New panel item",
        order: 1
      }]
    };
  };

  return {
    addingContent,
    startAddingItem,
    startAddingCollapsibleItem,
    startAddingContent,
    startAddingPanel,
    cancelAdding,
    createNewItem,
    createNewPanel
  };
};
