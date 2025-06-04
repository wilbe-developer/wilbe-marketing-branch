import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface LinkInputPortalProps {
  isVisible: boolean;
  position: { top: number; left: number } | null;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isMobile?: boolean;
}

export const LinkInputPortal: React.FC<LinkInputPortalProps> = ({
  isVisible,
  position,
  value,
  onChange,
  onConfirm,
  onCancel,
  isMobile = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (isVisible && position && !isMobile) {
      // Adjust position to keep popup within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popupWidth = 300;
      const popupHeight = 50;
      
      let { left, top } = position;
      
      // Keep within horizontal bounds
      if (left + popupWidth > viewportWidth - 20) {
        left = viewportWidth - popupWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }
      
      // Keep within vertical bounds
      if (top + popupHeight > viewportHeight - 20) {
        top = position.top - popupHeight - 20;
      }
      if (top < 20) {
        top = position.top + 40;
      }
      
      setAdjustedPosition({ left, top });
    } else {
      setAdjustedPosition(position);
    }
  }, [position, isVisible, isMobile]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Focus input after a short delay to ensure it's rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isVisible) return null;

  const content = (
    <>
      {/* Backdrop for desktop */}
      {!isMobile && (
        <div
          className="fixed inset-0 bg-black/10 z-[9998]"
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Link input container */}
      <div
        ref={containerRef}
        className={isMobile 
          ? "fixed bottom-4 left-4 right-4 z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg p-3"
          : "fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg"
        }
        style={!isMobile && adjustedPosition ? {
          top: adjustedPosition.top,
          left: adjustedPosition.left,
          minWidth: '300px'
        } : undefined}
        data-link-input-portal
      >
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter URL..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${isMobile ? 'h-10 text-base' : 'h-8 text-sm'} flex-1`}
          />
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={onConfirm}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0 text-green-600 hover:text-green-700 hover:bg-green-50`}
          >
            <Check className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={onCancel}
            className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0 text-red-600 hover:text-red-700 hover:bg-red-50`}
          >
            <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};
