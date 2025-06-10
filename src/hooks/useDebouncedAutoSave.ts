
import { useCallback, useRef, useState } from 'react';

interface UseDebouncedAutoSaveOptions {
  delay?: number;
  onSave: (value: any) => Promise<void>;
}

export const useDebouncedAutoSave = ({ delay = 500, onSave }: UseDebouncedAutoSaveOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveQueueRef = useRef<Promise<void> | null>(null);

  const debouncedSave = useCallback(async (value: any) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      // Wait for any existing save to complete
      if (saveQueueRef.current) {
        await saveQueueRef.current;
      }

      setIsSaving(true);
      
      try {
        // Create new save promise and add to queue
        saveQueueRef.current = onSave(value);
        await saveQueueRef.current;
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
        saveQueueRef.current = null;
      }
    }, delay);
  }, [delay, onSave]);

  const saveImmediately = useCallback(async (value: any) => {
    // Clear any pending debounced save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Wait for any existing save to complete
    if (saveQueueRef.current) {
      await saveQueueRef.current;
    }

    setIsSaving(true);
    
    try {
      saveQueueRef.current = onSave(value);
      await saveQueueRef.current;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Immediate save failed:', error);
    } finally {
      setIsSaving(false);
      saveQueueRef.current = null;
    }
  }, [onSave]);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    debouncedSave,
    saveImmediately,
    isSaving,
    lastSaved,
    cleanup
  };
};
