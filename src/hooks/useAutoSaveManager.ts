
import { useCallback, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'typing' | 'saving' | 'saved' | 'error';

interface PendingSave {
  value: any;
  saveCallback: (value: any) => Promise<void>;
  timestamp: number;
}

export class AutoSaveManager {
  private saveTimers: Map<string, NodeJS.Timeout> = new Map();
  private typingFields: Set<string> = new Set();
  private pendingSaves: Map<string, PendingSave> = new Map();
  private saveStatus: Map<string, SaveStatus> = new Map();
  private statusCallbacks: Map<string, (status: SaveStatus) => void> = new Map();

  constructor() {
    // Handle page unload - emergency save
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    }
  }

  private handlePageUnload = () => {
    // Force save all pending changes immediately
    this.pendingSaves.forEach((pendingSave, fieldId) => {
      if (!this.typingFields.has(fieldId)) {
        pendingSave.saveCallback(pendingSave.value).catch(console.error);
      }
    });
  };

  private updateStatus(fieldId: string, status: SaveStatus) {
    this.saveStatus.set(fieldId, status);
    const callback = this.statusCallbacks.get(fieldId);
    if (callback) {
      callback(status);
    }
  }

  private async executeSave(fieldId: string, value: any, saveCallback: (value: any) => Promise<void>) {
    try {
      this.updateStatus(fieldId, 'saving');
      await saveCallback(value);
      this.updateStatus(fieldId, 'saved');
      this.pendingSaves.delete(fieldId);
      
      // Auto-clear saved status after 2 seconds
      setTimeout(() => {
        if (this.saveStatus.get(fieldId) === 'saved') {
          this.updateStatus(fieldId, 'idle');
        }
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.updateStatus(fieldId, 'error');
      
      // Retry after 5 seconds
      setTimeout(() => {
        if (this.pendingSaves.has(fieldId)) {
          const pending = this.pendingSaves.get(fieldId)!;
          this.executeSave(fieldId, pending.value, pending.saveCallback);
        }
      }, 5000);
    }
  }

  startTyping(fieldId: string) {
    this.typingFields.add(fieldId);
    this.updateStatus(fieldId, 'typing');
  }

  stopTyping(fieldId: string) {
    this.typingFields.delete(fieldId);
    
    // If there's a pending save, execute it immediately
    if (this.pendingSaves.has(fieldId)) {
      const pending = this.pendingSaves.get(fieldId)!;
      this.executeSave(fieldId, pending.value, pending.saveCallback);
    } else {
      this.updateStatus(fieldId, 'idle');
    }
  }

  handleFieldChange(
    fieldId: string, 
    value: any, 
    isTyping: boolean, 
    saveCallback: (value: any) => Promise<void>
  ) {
    // Clear any existing timer
    const existingTimer = this.saveTimers.get(fieldId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Store the pending save
    this.pendingSaves.set(fieldId, {
      value,
      saveCallback,
      timestamp: Date.now()
    });

    if (isTyping) {
      this.startTyping(fieldId);
      
      // Set debounced save timer (2 seconds)
      const timer = setTimeout(() => {
        if (this.pendingSaves.has(fieldId) && this.typingFields.has(fieldId)) {
          const pending = this.pendingSaves.get(fieldId)!;
          this.executeSave(fieldId, pending.value, pending.saveCallback);
        }
      }, 2000);
      
      this.saveTimers.set(fieldId, timer);
    } else {
      // Immediate save on blur
      this.executeSave(fieldId, value, saveCallback);
    }
  }

  forceSave(fieldId: string) {
    if (this.pendingSaves.has(fieldId)) {
      const pending = this.pendingSaves.get(fieldId)!;
      this.executeSave(fieldId, pending.value, pending.saveCallback);
    }
  }

  getSaveStatus(fieldId: string): SaveStatus {
    return this.saveStatus.get(fieldId) || 'idle';
  }

  subscribeToStatus(fieldId: string, callback: (status: SaveStatus) => void) {
    this.statusCallbacks.set(fieldId, callback);
    return () => this.statusCallbacks.delete(fieldId);
  }

  isTyping(fieldId: string): boolean {
    return this.typingFields.has(fieldId);
  }

  cleanup() {
    this.saveTimers.forEach(timer => clearTimeout(timer));
    this.saveTimers.clear();
    this.typingFields.clear();
    this.pendingSaves.clear();
    this.saveStatus.clear();
    this.statusCallbacks.clear();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handlePageUnload);
    }
  }
}

export const useAutoSaveManager = () => {
  const managerRef = useRef<AutoSaveManager | null>(null);
  const [, forceUpdate] = useState({});

  if (!managerRef.current) {
    managerRef.current = new AutoSaveManager();
  }

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  return {
    manager: managerRef.current,
    triggerUpdate
  };
};
