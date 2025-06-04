
import React, { useState, useRef, useEffect } from 'react';
import { FloatingToolbar } from './FloatingToolbar';

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
  const editorRef = useRef<HTMLDivElement>(null);

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
        setToolbarPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + (rect.width / 2) - 150
        });
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    };

    const handleKeyUp = () => {
      setTimeout(handleSelection, 10);
    };

    if (isEditing) {
      document.addEventListener('selectionchange', handleSelection);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditing]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
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
    setToolbarPosition({
      top: editorRef.current?.getBoundingClientRect().top || 0,
      left: editorRef.current?.getBoundingClientRect().left || 0
    });
    setShowToolbar(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't hide toolbar if clicking on toolbar buttons
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('[data-floating-toolbar]')) {
      setTimeout(() => setShowToolbar(false), 100);
    }
  };

  return (
    <>
      <div
        ref={editorRef}
        contentEditable={isEditing}
        className={`prose max-w-none outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent rounded p-2 min-h-[1.5rem] ${className}`}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          border: isEditing ? '2px dashed #3b82f6' : 'none'
        }}
      />
      
      <div data-floating-toolbar>
        <FloatingToolbar
          onFormat={handleFormat}
          onSave={handleSave}
          onCancel={handleCancel}
          position={toolbarPosition}
          isVisible={showToolbar && isEditing}
        />
      </div>
    </>
  );
};
