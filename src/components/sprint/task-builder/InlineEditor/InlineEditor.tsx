import React, { useState, useRef, useEffect } from 'react';
import { FloatingToolbar } from './FloatingToolbar';
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface InlineEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  className?: string;
  placeholder?: string;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  content,
  onSave,
  onCancel,
  className = '',
  placeholder = 'Click to edit...'
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [storedSelection, setStoredSelection] = useState<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (editorRef.current && isEditing) {
      editorRef.current.focus();
      // Set initial content
      editorRef.current.innerHTML = content || '';
    }
  }, [isEditing, content]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Store selection for later use
        setStoredSelection(range.cloneRange());
        
        if (isMobile) {
          // On mobile, show toolbar at bottom of screen
          setToolbarPosition({
            top: window.innerHeight - 80,
            left: 10
          });
        } else {
          // Desktop: position above selection with viewport bounds checking
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const toolbarWidth = 300; // Approximate toolbar width
          const toolbarHeight = 50; // Approximate toolbar height
          
          let left = rect.left + window.scrollX + (rect.width / 2) - (toolbarWidth / 2);
          let top = rect.top + window.scrollY - toolbarHeight - 10;
          
          // Keep toolbar within viewport bounds
          if (left < 10) left = 10;
          if (left + toolbarWidth > viewportWidth - 10) left = viewportWidth - toolbarWidth - 10;
          if (top < 10) top = rect.bottom + window.scrollY + 10;
          if (top + toolbarHeight > viewportHeight - 10) top = rect.top + window.scrollY - toolbarHeight - 10;
          
          setToolbarPosition({ top, left });
        }
        setShowToolbar(true);
      } else if (!isMobile) {
        // On desktop, hide when no selection (but not on mobile during link editing)
        setShowToolbar(false);
      }
    };

    const handleKeyUp = () => {
      setTimeout(handleSelection, 10);
    };

    const handleTouchEnd = () => {
      // On mobile, show toolbar when touching in editor
      if (isMobile && editorRef.current?.contains(document.activeElement)) {
        setTimeout(handleSelection, 100);
      }
    };

    if (isEditing) {
      document.addEventListener('selectionchange', handleSelection);
      document.addEventListener('keyup', handleKeyUp);
      
      if (isMobile) {
        document.addEventListener('touchend', handleTouchEnd);
      }
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('keyup', handleKeyUp);
      if (isMobile) {
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isEditing, isMobile]);

  const restoreSelection = () => {
    if (storedSelection && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(storedSelection);
        editorRef.current.focus();
      }
    }
  };

  const handleFormat = (command: string, value?: string) => {
    if (command === 'createLink' && value) {
      // Restore selection before creating link
      restoreSelection();
      setTimeout(() => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
      }, 10);
    } else {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onSave(htmlContent);
      setIsEditing(false);
      setShowToolbar(false);
    }
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || '';
    }
    onCancel();
    setIsEditing(false);
    setShowToolbar(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
      }
    }
    
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleFocus = () => {
    if (isMobile) {
      // On mobile, show toolbar when focused
      setToolbarPosition({
        top: window.innerHeight - 80,
        left: 10
      });
      setShowToolbar(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't hide toolbar if clicking on toolbar buttons, save/cancel bar, or link input
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || (
      !relatedTarget.closest('[data-floating-toolbar]') && 
      !relatedTarget.closest('[data-save-cancel-bar]') &&
      !relatedTarget.closest('[data-link-input]')
    )) {
      if (!isMobile) {
        setTimeout(() => setShowToolbar(false), 100);
      }
    }
  };

  return (
    <div className="relative">
      {/* Save/Cancel Bar */}
      {isEditing && (
        <div 
          data-save-cancel-bar
          className="absolute -top-10 left-0 right-0 z-40 flex items-center justify-end gap-2 bg-white border border-gray-200 rounded-t-md px-3 py-1 shadow-sm"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>
      )}
      
      <div
        ref={editorRef}
        contentEditable={isEditing}
        className={`prose max-w-none outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent rounded p-2 min-h-[1.5rem] ${className}`}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        style={{
          border: isEditing ? '2px dashed #3b82f6' : 'none'
        }}
      />
      
      <div data-floating-toolbar>
        <FloatingToolbar
          onFormat={handleFormat}
          position={toolbarPosition}
          isVisible={showToolbar && isEditing}
          isMobile={isMobile}
          onSelectionRestore={restoreSelection}
        />
      </div>
    </div>
  );
};
