
import { useRef } from 'react';

export const useScrollHandler = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleMouseWheel = (e: any) => {
    e.preventDefault();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return { scrollRef, handleScroll, handleMouseWheel };
};
