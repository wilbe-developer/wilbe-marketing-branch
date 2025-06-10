import { useState, useCallback, useRef, useEffect } from 'react';
import { TeamMember } from '@/hooks/team-members/types';

export type TeamMemberSaveStatus = 'idle' | 'typing' | 'saving' | 'saved' | 'error';

interface FieldStatus {
  status: TeamMemberSaveStatus;
  error?: string;
}

interface UseTeamMemberAutoSaveProps {
  initialMembers: TeamMember[];
  onSave: (members: TeamMember[]) => Promise<void>;
  debounceMs?: number;
}

export const useTeamMemberAutoSave = ({
  initialMembers,
  onSave,
  debounceMs = 1000
}: UseTeamMemberAutoSaveProps) => {
  // Local state for UI display only
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, FieldStatus>>({});
  
  // Refs for managing state without stale closures
  const membersRef = useRef<TeamMember[]>(initialMembers);
  const pendingChanges = useRef<Record<string, any>>({});
  const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Keep refs in sync with initial data
  useEffect(() => {
    setMembers(initialMembers);
    membersRef.current = initialMembers;
    // Clear any pending changes when initial data changes
    pendingChanges.current = {};
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
  
  // Apply a pending change to the members array
  const applyPendingChange = useCallback((memberIndex: number, fieldName: keyof TeamMember, value: string) => {
    const currentMembers = [...membersRef.current];
    currentMembers[memberIndex] = {
      ...currentMembers[memberIndex],
      [fieldName]: value
    };
    return currentMembers;
  }, []);
  
  // Handle field changes with proper debouncing
  const handleFieldChange = useCallback((
    memberIndex: number,
    fieldName: keyof TeamMember,
    value: string
  ) => {
    const fieldId = createFieldId(memberIndex, fieldName);
    
    console.log(`Field change: ${fieldId} = ${value}`);
    
    // Update UI immediately for responsiveness
    setMembers(prev => {
      const updated = [...prev];
      updated[memberIndex] = {
        ...updated[memberIndex],
        [fieldName]: value
      };
      return updated;
    });
    
    // Store the pending change
    pendingChanges.current[fieldId] = { memberIndex, fieldName, value };
    
    // Clear existing timeouts for this field
    if (saveTimeouts.current[fieldId]) {
      clearTimeout(saveTimeouts.current[fieldId]);
      delete saveTimeouts.current[fieldId];
    }
    if (typingTimeouts.current[fieldId]) {
      clearTimeout(typingTimeouts.current[fieldId]);
      delete typingTimeouts.current[fieldId];
    }
    
    // Set status to typing immediately
    updateFieldStatus(fieldId, 'typing');
    
    // Set timeout to clear typing status if no more changes
    typingTimeouts.current[fieldId] = setTimeout(() => {
      const currentStatus = fieldStatuses[fieldId]?.status;
      if (currentStatus === 'typing') {
        updateFieldStatus(fieldId, 'idle');
      }
      delete typingTimeouts.current[fieldId];
    }, debounceMs + 500); // Clear typing status after debounce + buffer
    
    // Set up debounced save
    saveTimeouts.current[fieldId] = setTimeout(async () => {
      console.log(`Starting save for field: ${fieldId}`);
      
      // Check if we still have a pending change for this field
      const pendingChange = pendingChanges.current[fieldId];
      if (!pendingChange) {
        console.log(`No pending change for ${fieldId}, skipping save`);
        return;
      }
      
      updateFieldStatus(fieldId, 'saving');
      
      try {
        // Apply the pending change to get the updated members array
        const updatedMembers = applyPendingChange(
          pendingChange.memberIndex,
          pendingChange.fieldName,
          pendingChange.value
        );
        
        console.log(`Saving members for field ${fieldId}:`, updatedMembers);
        await onSave(updatedMembers);
        
        // Update the ref with the saved state
        membersRef.current = updatedMembers;
        
        // Clear the pending change
        delete pendingChanges.current[fieldId];
        
        updateFieldStatus(fieldId, 'saved');
        
        // Clear saved status after delay
        setTimeout(() => {
          updateFieldStatus(fieldId, 'idle');
        }, 2000);
        
      } catch (error) {
        console.error('Error saving team member field:', error);
        updateFieldStatus(fieldId, 'error', error instanceof Error ? error.message : 'Save failed');
        
        // Keep the pending change for retry
        // User can try again by typing
      } finally {
        // Clean up timeout
        delete saveTimeouts.current[fieldId];
      }
    }, debounceMs);
    
  }, [onSave, debounceMs, updateFieldStatus, applyPendingChange, fieldStatuses]);
  
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
    Object.keys(saveTimeouts.current).forEach(fieldId => {
      if (fieldId.startsWith(`team_member_${index}_`)) {
        clearTimeout(saveTimeouts.current[fieldId]);
        delete saveTimeouts.current[fieldId];
        delete pendingChanges.current[fieldId];
      }
    });
    
    // Clear typing timeouts too
    Object.keys(typingTimeouts.current).forEach(fieldId => {
      if (fieldId.startsWith(`team_member_${index}_`)) {
        clearTimeout(typingTimeouts.current[fieldId]);
        delete typingTimeouts.current[fieldId];
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
    const pendingFieldIds = Object.keys(pendingChanges.current);
    
    if (pendingFieldIds.length === 0) {
      console.log('No pending changes to save');
      return;
    }
    
    console.log(`Force saving ${pendingFieldIds.length} pending changes`);
    
    // Clear all timeouts
    pendingFieldIds.forEach(fieldId => {
      if (saveTimeouts.current[fieldId]) {
        clearTimeout(saveTimeouts.current[fieldId]);
        delete saveTimeouts.current[fieldId];
      }
      if (typingTimeouts.current[fieldId]) {
        clearTimeout(typingTimeouts.current[fieldId]);
        delete typingTimeouts.current[fieldId];
      }
    });
    
    // Apply all pending changes
    let updatedMembers = [...membersRef.current];
    Object.entries(pendingChanges.current).forEach(([fieldId, change]) => {
      updatedMembers[change.memberIndex] = {
        ...updatedMembers[change.memberIndex],
        [change.fieldName]: change.value
      };
      updateFieldStatus(fieldId, 'saving');
    });
    
    try {
      await onSave(updatedMembers);
      
      // Update ref and clear pending changes
      membersRef.current = updatedMembers;
      pendingChanges.current = {};
      
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
      Object.values(saveTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      Object.values(typingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);
  
  return {
    members,
    handleFieldChange,
    handleAddMember,
    handleRemoveMember,
    getFieldStatus,
    forceSaveAll
  };
};
