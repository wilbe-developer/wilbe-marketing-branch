import React, { useState, useRef, useEffect } from 'react';
import { FloatingToolbar } from './FloatingToolbar';
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useContainerAwarePositioning } from './useContainerAwarePositioning';

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
  const [isLinkEditing, setIsLinkEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { calculatePosition } = useContainerAwarePositioning();

  useEffect(() => {
    if (editorRef.current && isEditing) {
      editorRef.current.focus();
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
          // Desktop: use container-aware positioning
          const position = calculatePosition(rect);
          setToolbarPosition({ top: position.top, left: position.left });
        }
        setShowToolbar(true);
      } else if (!isMobile && !isLinkEditing) {
        // Only hide toolbar if not in link editing mode
        setShowToolbar(false);
      }
    };

    const handleKeyUp = () => {
      setTimeout(handleSelection, 10);
    };

    const handleTouchEnd = () => {
      if (isMobile && editorRef.current?.contains(document.activeElement)) {
        setTimeout(handleSelection, 100);
      }
    };

    const handleScroll = () => {
      // Reposition toolbar on scroll for desktop
      if (!isMobile && showToolbar && storedSelection) {
        const rect = storedSelection.getBoundingClientRect();
        const position = calculatePosition(rect);
        setToolbarPosition({ top: position.top, left: position.left });
      }
    };

    if (isEditing) {
      document.addEventListener('selectionchange', handleSelection);
      document.addEventListener('keyup', handleKeyUp);
      document.addEventListener('scroll', handleScroll, true); // Use capture for all scroll events
      
      if (isMobile) {
        document.addEventListener('touchend', handleTouchEnd);
      }
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('scroll', handleScroll, true);
      if (isMobile) {
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isEditing, isMobile, isLinkEditing, showToolbar, storedSelection, calculatePosition]);

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
      restoreSelection();
      setTimeout(() => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        setIsLinkEditing(false);
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
      setIsLinkEditing(false);
    }
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || '';
    }
    onCancel();
    setIsEditing(false);
    setShowToolbar(false);
    setIsLinkEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't handle shortcuts if in link editing mode
    if (isLinkEditing) return;
    
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
    
    if (e.key === 'Escape' && !isLinkEditing) {
      handleCancel();
    }
  };

  const handleFocus = () => {
    if (isMobile) {
      setToolbarPosition({
        top: window.innerHeight - 80,
        left: 10
      });
      setShowToolbar(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Don't hide toolbar if focusing on toolbar elements or during link editing
    if (isLinkEditing || !relatedTarget || (
      relatedTarget.closest('[data-floating-toolbar]') || 
      relatedTarget.closest('[data-save-cancel-bar]') ||
      relatedTarget.closest('[data-link-input-portal]')
    )) {
      return;
    }
    
    if (!isMobile) {
      setTimeout(() => {
        if (!isLinkEditing) {
          setShowToolbar(false);
        }
      }, 100);
    }
  };

  const handleLinkEditingChange = (isEditing: boolean) => {
    setIsLinkEditing(isEditing);
    if (!isEditing && !isMobile) {
      // Small delay to prevent toolbar from disappearing too quickly
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setShowToolbar(false);
        }
      }, 100);
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
          onLinkEditingChange={handleLinkEditingChange}
        />
      </div>
    </div>
  );
};
