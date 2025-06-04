import { useCallback } from 'react';

interface PositionResult {
  top: number;
  left: number;
  strategy: 'above' | 'below' | 'side' | 'fixed-top' | 'fixed-bottom';
}

export const useContainerAwarePositioning = () => {
  const calculatePosition = useCallback((
    selectionRect: DOMRect,
    toolbarWidth: number = 300,
    toolbarHeight: number = 50
  ): PositionResult => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return {
        top: selectionRect.top - toolbarHeight - 10,
        left: selectionRect.left,
        strategy: 'above'
      };
    }

    // Find the closest scrollable container
    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer as Element;
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement!;
    }

    let scrollableContainer: Element | null = null;
    let current = container;
    
    while (current && current !== document.body) {
      const styles = window.getComputedStyle(current);
      const overflow = styles.overflow + styles.overflowY + styles.overflowX;
      
      if (overflow.includes('scroll') || overflow.includes('auto')) {
        scrollableContainer = current;
        break;
      }
      current = current.parentElement!;
    }

    // Use viewport if no scrollable container found
    const containerRect = scrollableContainer?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight
    };

    const containerBounds = {
      top: containerRect.top + 10, // padding
      left: containerRect.left + 10,
      right: containerRect.right - 10,
      bottom: containerRect.bottom - 10,
      width: containerRect.width - 20,
      height: containerRect.height - 20
    };

    // Calculate selection center
    const selectionCenterX = selectionRect.left + (selectionRect.width / 2);
    const selectionTop = selectionRect.top;
    const selectionBottom = selectionRect.bottom;

    // Strategy 1: Above selection (preferred)
    const aboveTop = selectionTop - toolbarHeight - 10;
    if (aboveTop >= containerBounds.top) {
      let left = selectionCenterX - (toolbarWidth / 2);
      
      // Keep within container horizontal bounds
      if (left < containerBounds.left) left = containerBounds.left;
      if (left + toolbarWidth > containerBounds.right) left = containerBounds.right - toolbarWidth;
      
      return { top: aboveTop, left, strategy: 'above' };
    }

    // Strategy 2: Below selection
    const belowTop = selectionBottom + 10;
    if (belowTop + toolbarHeight <= containerBounds.bottom) {
      let left = selectionCenterX - (toolbarWidth / 2);
      
      // Keep within container horizontal bounds
      if (left < containerBounds.left) left = containerBounds.left;
      if (left + toolbarWidth > containerBounds.right) left = containerBounds.right - toolbarWidth;
      
      return { top: belowTop, left, strategy: 'below' };
    }

    // Strategy 3: To the side (if width allows)
    if (containerBounds.width > toolbarWidth + selectionRect.width + 20) {
      const rightSide = selectionRect.right + 10;
      const leftSide = selectionRect.left - toolbarWidth - 10;
      
      let top = selectionTop - (toolbarHeight / 2);
      if (top < containerBounds.top) top = containerBounds.top;
      if (top + toolbarHeight > containerBounds.bottom) top = containerBounds.bottom - toolbarHeight;
      
      if (rightSide + toolbarWidth <= containerBounds.right) {
        return { top, left: rightSide, strategy: 'side' };
      } else if (leftSide >= containerBounds.left) {
        return { top, left: leftSide, strategy: 'side' };
      }
    }

    // Strategy 4: Fixed position at container top
    if (containerBounds.height > toolbarHeight + 20) {
      let left = selectionCenterX - (toolbarWidth / 2);
      if (left < containerBounds.left) left = containerBounds.left;
      if (left + toolbarWidth > containerBounds.right) left = containerBounds.right - toolbarWidth;
      
      return { 
        top: containerBounds.top + 10, 
        left, 
        strategy: 'fixed-top' 
      };
    }

    // Strategy 5: Fixed position at container bottom (last resort)
    let left = selectionCenterX - (toolbarWidth / 2);
    if (left < containerBounds.left) left = containerBounds.left;
    if (left + toolbarWidth > containerBounds.right) left = containerBounds.right - toolbarWidth;
    
    return { 
      top: containerBounds.bottom - toolbarHeight - 10, 
      left, 
      strategy: 'fixed-bottom' 
    };
  }, []);

  return { calculatePosition };
};
