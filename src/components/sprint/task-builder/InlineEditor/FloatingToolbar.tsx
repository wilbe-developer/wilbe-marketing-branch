import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Link, Save, X } from "lucide-react";

interface FloatingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onSave: () => void;
  onCancel: () => void;
  position: { top: number; left: number } | null;
  isVisible: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onFormat,
  onSave,
  onCancel,
  position,
  isVisible
}) => {
  if (!isVisible || !position) return null;

  const formatUrl = (url: string): string => {
    // Remove any leading/trailing whitespace
    url = url.trim();
    
    // If URL already has a protocol, return as is
    if (url.match(/^https?:\/\//)) {
      return url;
    }
    
    // If it starts with www., add https://
    if (url.startsWith('www.')) {
      return `https://${url}`;
    }
    
    // If it looks like a domain (contains a dot and no spaces), add https://
    if (url.includes('.') && !url.includes(' ')) {
      return `https://${url}`;
    }
    
    // Otherwise, return as is (might be a relative path or other type of link)
    return url;
  };

  const handleLinkClick = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const formattedUrl = formatUrl(url);
      onFormat('createLink', formattedUrl);
    }
  };

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-1 transition-opacity duration-200"
      style={{ 
        top: position.top - 60, 
        left: position.left,
        opacity: isVisible ? 1 : 0
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('insertUnorderedList')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('insertOrderedList')}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLinkClick}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
