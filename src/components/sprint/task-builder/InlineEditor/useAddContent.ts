
import { useState } from 'react';
import { StaticPanelItem } from '@/types/task-builder';

interface AddContentState {
  type: 'item' | 'collapsible-item' | 'content' | null;
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

  return {
    addingContent,
    startAddingItem,
    startAddingCollapsibleItem,
    startAddingContent,
    cancelAdding,
    createNewItem
  };
};
