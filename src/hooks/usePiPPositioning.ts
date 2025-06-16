
import { useState, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface Position {
  x: number;
  y: number;
}

interface UsePiPPositioningProps {
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
}

const CORNER_SNAP_THRESHOLD = 50;
const EDGE_PADDING = 16;

export const usePiPPositioning = ({ size, isVisible }: UsePiPPositioningProps) => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState<Position>({ x: EDGE_PADDING, y: EDGE_PADDING });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; elementX: number; elementY: number }>();

  // Size configurations
  const getSizeConfig = useCallback(() => {
    const configs = {
      small: isMobile ? { width: 192, height: 112 } : { width: 256, height: 144 },
      medium: isMobile ? { width: 256, height: 160 } : { width: 320, height: 192 },
      large: isMobile ? { width: 320, height: 192 } : { width: 384, height: 240 }
    };
    return configs[size];
  }, [size, isMobile]);

  // Smart positioning to avoid system UI
  const getSmartPosition = useCallback((x: number, y: number) => {
    const sizeConfig = getSizeConfig();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Account for system UI on mobile
    const topSafeArea = isMobile ? 60 : 0; // Status bar + notch
    const bottomSafeArea = isMobile ? 90 : 0; // Home indicator
    
    const maxX = viewportWidth - sizeConfig.width - EDGE_PADDING;
    const maxY = viewportHeight - sizeConfig.height - EDGE_PADDING - bottomSafeArea;
    const minY = EDGE_PADDING + topSafeArea;
    
    return {
      x: Math.max(EDGE_PADDING, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }, [getSizeConfig, isMobile]);

  // Corner snapping logic
  const snapToCorner = useCallback((x: number, y: number) => {
    const sizeConfig = getSizeConfig();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const topSafeArea = isMobile ? 60 : 0;
    const bottomSafeArea = isMobile ? 90 : 0;
    
    const corners = [
      { x: EDGE_PADDING, y: EDGE_PADDING + topSafeArea }, // Top-left
      { x: viewportWidth - sizeConfig.width - EDGE_PADDING, y: EDGE_PADDING + topSafeArea }, // Top-right
      { x: EDGE_PADDING, y: viewportHeight - sizeConfig.height - EDGE_PADDING - bottomSafeArea }, // Bottom-left
      { x: viewportWidth - sizeConfig.width - EDGE_PADDING, y: viewportHeight - sizeConfig.height - EDGE_PADDING - bottomSafeArea } // Bottom-right
    ];

    let closestCorner = corners[0];
    let minDistance = Infinity;

    corners.forEach(corner => {
      const distance = Math.sqrt(Math.pow(x - corner.x, 2) + Math.pow(y - corner.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestCorner = corner;
      }
    });

    return minDistance < CORNER_SNAP_THRESHOLD ? closestCorner : { x, y };
  }, [getSizeConfig, isMobile]);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (isMobile) return; // Disable dragging on mobile
    
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      elementX: position.x,
      elementY: position.y
    };
  }, [position, isMobile]);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    
    const newX = dragStartRef.current.elementX + deltaX;
    const newY = dragStartRef.current.elementY + deltaY;
    
    const smartPosition = getSmartPosition(newX, newY);
    setPosition(smartPosition);
  }, [isDragging, getSmartPosition]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsSnapping(true);
    
    // Snap to corner with animation
    const snappedPosition = snapToCorner(position.x, position.y);
    setPosition(snappedPosition);
    
    setTimeout(() => setIsSnapping(false), 300);
  }, [isDragging, position, snapToCorner]);

  // Initialize position when becoming visible
  useEffect(() => {
    if (isVisible) {
      const sizeConfig = getSizeConfig();
      const initialX = window.innerWidth - sizeConfig.width - EDGE_PADDING;
      const initialY = EDGE_PADDING + (isMobile ? 60 : 0);
      setPosition(getSmartPosition(initialX, initialY));
    }
  }, [isVisible, getSizeConfig, getSmartPosition, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prevPosition => getSmartPosition(prevPosition.x, prevPosition.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSmartPosition]);

  return {
    position,
    isDragging,
    isSnapping,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    getSizeConfig
  };
};
