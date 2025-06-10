import { useState, useCallback, useRef, useEffect } from 'react';
import { TeamMember } from '@/hooks/team-members/types';

export type TeamMemberSaveStatus = 'idle' | 'typing' | 'saving' | 'saved' | 'error';

interface FieldStatus {
  status: TeamMemberSaveStatus;
  error?: string;
}

interface PendingSave {
  memberIndex: number;
  fieldName: keyof TeamMember;
  value: string;
  timestamp: number;
}

interface UseTeamMemberAutoSaveProps {
  initialMembers: TeamMember[];
  onSave: (members: TeamMember[]) => Promise<void>;
  debounceMs?: number;
}

export const useTeamMemberAutoSave = ({
  initialMembers,
  onSave,
  debounceMs = 2000
}: UseTeamMemberAutoSaveProps) => {
  // Local state for UI display only
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, FieldStatus>>({});
  
  // Refs for managing state without stale closures
  const membersRef = useRef<TeamMember[]>(initialMembers);
  const saveTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const typingFields = useRef<Set<string>>(new Set());
  const pendingSaves = useRef<Map<string, PendingSave>>(new Map());
  
  // Keep refs in sync with initial data
  useEffect(() => {
    setMembers(initialMembers);
    membersRef.current = initialMembers;
    // Clear any pending changes when initial data changes
    pendingSaves.current.clear();
  }, [initialMembers]);
  
  // Helper to create field ID
  const createFieldId = (memberIndex: number, fieldName: keyof TeamMember) => {
    return `team_member_${memberIndex}_${fieldName}`;
  };
  
  // Update field status
  const updateFieldStatus = useCallback((fieldId: string, status: TeamMemberSaveStatus, error?: string) => {
    setFieldStatuses(prev => ({
      ...prev,
      [fieldId]: { status, error }
    }));
  }, []);

  // Execute save operation
  const executeSave = useCallback(async (fieldId: string, memberIndex: number, fieldName: keyof TeamMember, value: string) => {
    try {
      updateFieldStatus(fieldId, 'saving');
      
      // Apply the change to get updated members array
      const updatedMembers = [...membersRef.current];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        [fieldName]: value
      };
      
      console.log(`Saving members for field ${fieldId}:`, updatedMembers);
      await onSave(updatedMembers);
      
      // Update the ref with the saved state
      membersRef.current = updatedMembers;
      
      // Clear the pending save
      pendingSaves.current.delete(fieldId);
      
      updateFieldStatus(fieldId, 'saved');
      
      // Auto-clear saved status after 2 seconds
      setTimeout(() => {
        if (fieldStatuses[fieldId]?.status === 'saved') {
          updateFieldStatus(fieldId, 'idle');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      updateFieldStatus(fieldId, 'error', error instanceof Error ? error.message : 'Save failed');
      
      // Retry after 5 seconds
      setTimeout(() => {
        if (pendingSaves.current.has(fieldId)) {
          const pending = pendingSaves.current.get(fieldId)!;
          executeSave(fieldId, pending.memberIndex, pending.fieldName, pending.value);
        }
      }, 5000);
    }
  }, [onSave, updateFieldStatus, fieldStatuses]);

  // Start typing for a field
  const startTyping = useCallback((memberIndex: number, fieldName: keyof TeamMember) => {
    const fieldId = createFieldId(memberIndex, fieldName);
    typingFields.current.add(fieldId);
    updateFieldStatus(fieldId, 'typing');
  }, [updateFieldStatus]);

  // Stop typing for a field
  const stopTyping = useCallback((memberIndex: number, fieldName: keyof TeamMember) => {
    const fieldId = createFieldId(memberIndex, fieldName);
    typingFields.current.delete(fieldId);
    
    // If there's a pending save, execute it immediately
    if (pendingSaves.current.has(fieldId)) {
      const pending = pendingSaves.current.get(fieldId)!;
      executeSave(fieldId, pending.memberIndex, pending.fieldName, pending.value);
    } else {
      updateFieldStatus(fieldId, 'idle');
    }
  }, [updateFieldStatus, executeSave]);
  
  // Handle field changes with proper debouncing
  const handleFieldChange = useCallback((
    memberIndex: number,
    fieldName: keyof TeamMember,
    value: string,
    isTyping: boolean = true
  ) => {
    const fieldId = createFieldId(memberIndex, fieldName);
    
    console.log(`Field change: ${fieldId} = ${value}, isTyping: ${isTyping}`);
    
    // Update UI immediately for responsiveness
    setMembers(prev => {
      const updated = [...prev];
      updated[memberIndex] = {
        ...updated[memberIndex],
        [fieldName]: value
      };
      return updated;
    });
    
    // Clear any existing timer
    const existingTimer = saveTimers.current.get(fieldId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Store the pending save
    pendingSaves.current.set(fieldId, {
      memberIndex,
      fieldName,
      value,
      timestamp: Date.now()
    });

    if (isTyping) {
      startTyping(memberIndex, fieldName);
      
      // Set debounced save timer
      const timer = setTimeout(() => {
        if (pendingSaves.current.has(fieldId) && typingFields.current.has(fieldId)) {
          const pending = pendingSaves.current.get(fieldId)!;
          executeSave(fieldId, pending.memberIndex, pending.fieldName, pending.value);
        }
      }, debounceMs);
      
      saveTimers.current.set(fieldId, timer);
    } else {
      // Immediate save on blur
      executeSave(fieldId, memberIndex, fieldName, value);
    }
  }, [startTyping, executeSave, debounceMs]);
  
  // Handle adding a new member (immediate save)
  const handleAddMember = useCallback(async () => {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: "",
      profile_description: "",
      employment_status: "",
      trigger_points: "",
      relationship_description: "",
    };
    
    const updatedMembers = [...membersRef.current, newMember];
    
    // Update UI immediately
    setMembers(updatedMembers);
    
    try {
      await onSave(updatedMembers);
      // Update ref on successful save
      membersRef.current = updatedMembers;
    } catch (error) {
      console.error('Error adding team member:', error);
      // Revert UI on error
      setMembers(membersRef.current);
    }
  }, [onSave]);
  
  // Handle removing a member (immediate save)
  const handleRemoveMember = useCallback(async (index: number) => {
    const updatedMembers = [...membersRef.current];
    updatedMembers.splice(index, 1);
    
    // Update UI immediately
    setMembers(updatedMembers);
    
    // Clear any pending saves for this member
    saveTimers.current.forEach((timer, fieldId) => {
      if (fieldId.startsWith(`team_member_${index}_`)) {
        clearTimeout(timer);
        saveTimers.current.delete(fieldId);
        pendingSaves.current.delete(fieldId);
        typingFields.current.delete(fieldId);
      }
    });
    
    try {
      await onSave(updatedMembers);
      // Update ref on successful save
      membersRef.current = updatedMembers;
    } catch (error) {
      console.error('Error removing team member:', error);
      // Revert UI on error
      setMembers(membersRef.current);
    }
  }, [onSave]);
  
  // Get field status
  const getFieldStatus = useCallback((memberIndex: number, fieldName: keyof TeamMember): TeamMemberSaveStatus => {
    const fieldId = createFieldId(memberIndex, fieldName);
    return fieldStatuses[fieldId]?.status || 'idle';
  }, [fieldStatuses]);
  
  // Force save all pending changes
  const forceSaveAll = useCallback(async () => {
    const pendingFieldIds = Array.from(pendingSaves.current.keys());
    
    if (pendingFieldIds.length === 0) {
      console.log('No pending changes to save');
      return;
    }
    
    console.log(`Force saving ${pendingFieldIds.length} pending changes`);
    
    // Clear all timers
    saveTimers.current.forEach(timer => clearTimeout(timer));
    saveTimers.current.clear();
    typingFields.current.clear();
    
    // Apply all pending changes
    let updatedMembers = [...membersRef.current];
    pendingSaves.current.forEach((pendingSave, fieldId) => {
      updatedMembers[pendingSave.memberIndex] = {
        ...updatedMembers[pendingSave.memberIndex],
        [pendingSave.fieldName]: pendingSave.value
      };
      updateFieldStatus(fieldId, 'saving');
    });
    
    try {
      await onSave(updatedMembers);
      
      // Update ref and clear pending changes
      membersRef.current = updatedMembers;
      pendingSaves.current.clear();
      
      // Set all to saved
      pendingFieldIds.forEach(fieldId => {
        updateFieldStatus(fieldId, 'saved');
        setTimeout(() => {
          updateFieldStatus(fieldId, 'idle');
        }, 2000);
      });
      
    } catch (error) {
      console.error('Error force saving:', error);
      pendingFieldIds.forEach(fieldId => {
        updateFieldStatus(fieldId, 'error');
      });
    }
  }, [onSave, updateFieldStatus]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      saveTimers.current.forEach(timer => clearTimeout(timer));
      saveTimers.current.clear();
    };
  }, []);
  
  return {
    members,
    handleFieldChange,
    handleAddMember,
    handleRemoveMember,
    getFieldStatus,
    forceSaveAll,
    startTyping,
    stopTyping
  };
};
