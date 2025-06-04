import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Link, Unlink } from "lucide-react";
import { LinkInputPortal } from './LinkInputPortal';

interface FloatingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  position: { top: number; left: number } | null;
  isVisible: boolean;
  isMobile?: boolean;
  onSelectionRestore?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onFormat,
  position,
  isVisible,
  isMobile = false,
  onSelectionRestore
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkInputPosition, setLinkInputPosition] = useState<{ top: number; left: number } | null>(null);

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
    // Calculate position for link input based on current toolbar position
    if (!isMobile && position) {
      setLinkInputPosition({
        top: position.top + 50, // Position below toolbar
        left: position.left
      });
    }
    setShowLinkInput(true);
    setLinkUrl('');
  };

  const handleLinkConfirm = () => {
    if (linkUrl.trim()) {
      const formattedUrl = formatUrl(linkUrl);
      
      // Restore selection before applying link
      if (onSelectionRestore) {
        onSelectionRestore();
      }
      
      setTimeout(() => {
        onFormat('createLink', formattedUrl);
      }, 10);
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

  const toolbarClass = isMobile 
    ? "fixed z-[9997] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 left-2 right-2"
    : "fixed z-[9997] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200";

  const toolbarStyle = isMobile 
    ? { 
        bottom: 20,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)'
      }
    : { 
        top: position.top, 
        left: position.left,
        opacity: isVisible ? 1 : 0
      };

  return (
    <>
      <div 
        className={toolbarClass}
        style={toolbarStyle}
      >
        <div className={`${isMobile ? 'p-3' : 'p-2'} flex items-center gap-1 justify-center`}>
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onFormat('bold')}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
          >
            <Bold className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onFormat('italic')}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
          >
            <Italic className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onFormat('underline')}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
          >
            <Underline className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          
          <div className={`w-px ${isMobile ? 'h-8' : 'h-6'} bg-gray-300 mx-1`} />
          
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onFormat('insertUnorderedList')}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
          >
            <List className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={() => onFormat('insertOrderedList')}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
          >
            <ListOrdered className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          
          <div className={`w-px ${isMobile ? 'h-8' : 'h-6'} bg-gray-300 mx-1`} />
          
          {isSelectionInLink() ? (
            <Button
              variant="ghost"
              size={isMobile ? "default" : "sm"}
              onClick={handleUnlink}
              className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
            >
              <Unlink className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size={isMobile ? "default" : "sm"}
              onClick={handleLinkClick}
              className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
            >
              <Link className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          )}
        </div>
      </div>

      <LinkInputPortal
        isVisible={showLinkInput}
        position={linkInputPosition}
        value={linkUrl}
        onChange={setLinkUrl}
        onConfirm={handleLinkConfirm}
        onCancel={handleLinkCancel}
        isMobile={isMobile}
      />
    </>
  );
};
