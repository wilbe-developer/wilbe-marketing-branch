import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, Underline, List, ListOrdered, Link, Unlink, Check, X } from "lucide-react";

interface FloatingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  position: { top: number; left: number } | null;
  isVisible: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onFormat,
  position,
  isVisible
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

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
    setShowLinkInput(true);
    setLinkUrl('');
  };

  const handleLinkConfirm = () => {
    if (linkUrl.trim()) {
      const formattedUrl = formatUrl(linkUrl);
      onFormat('createLink', formattedUrl);
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleLinkCancel = () => {
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleUnlink = () => {
    onFormat('unlink');
  };

  const isSelectionInLink = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
      
      while (element) {
        if (element.tagName === 'A') {
          return true;
        }
        element = element.parentElement;
      }
    }
    return false;
  };

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg transition-opacity duration-200"
      style={{ 
        top: position.top - 60, 
        left: position.left,
        opacity: isVisible ? 1 : 0
      }}
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1 p-2">
          <Input
            type="text"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLinkConfirm();
              } else if (e.key === 'Escape') {
                handleLinkCancel();
              }
            }}
            className="h-8 w-48 text-sm"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLinkConfirm}
            className="h-8 w-8 p-0 text-green-600"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLinkCancel}
            className="h-8 w-8 p-0 text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-2 flex items-center gap-1">
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
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {isSelectionInLink() ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnlink}
              className="h-8 w-8 p-0"
            >
              <Unlink className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLinkClick}
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
