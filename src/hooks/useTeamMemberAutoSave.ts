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
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, FieldStatus>>({});
  
  // Use refs to track current state without stale closures
  const membersRef = useRef<TeamMember[]>(initialMembers);
  const pendingSaves = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Keep refs in sync with state
  useEffect(() => {
    membersRef.current = members;
  }, [members]);
  
  // Update members when initialMembers changes
  useEffect(() => {
    setMembers(initialMembers);
    membersRef.current = initialMembers;
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
  
  // Handle field changes with auto-save
  const handleFieldChange = useCallback((
    memberIndex: number,
    fieldName: keyof TeamMember,
    value: string
  ) => {
    const fieldId = createFieldId(memberIndex, fieldName);
    
    console.log(`Field change: ${fieldId} = ${value}`);
    
    // Update local state immediately
    setMembers(prev => {
      const updated = [...prev];
      updated[memberIndex] = {
        ...updated[memberIndex],
        [fieldName]: value
      };
      return updated;
    });
    
    // Clear existing timeout for this field
    if (pendingSaves.current[fieldId]) {
      clearTimeout(pendingSaves.current[fieldId]);
      delete pendingSaves.current[fieldId];
    }
    
    // Set status to typing immediately
    updateFieldStatus(fieldId, 'typing');
    
    // Set up debounced save using the current members from ref
    pendingSaves.current[fieldId] = setTimeout(async () => {
      console.log(`Starting save for field: ${fieldId}`);
      updateFieldStatus(fieldId, 'saving');
      
      try {
        // Get fresh state from ref and apply the change
        const currentMembers = [...membersRef.current];
        currentMembers[memberIndex] = {
          ...currentMembers[memberIndex],
          [fieldName]: value
        };
        
        console.log(`Saving members:`, currentMembers);
        await onSave(currentMembers);
        
        updateFieldStatus(fieldId, 'saved');
        
        // Clear saved status after delay
        setTimeout(() => {
          updateFieldStatus(fieldId, 'idle');
        }, 2000);
        
      } catch (error) {
        console.error('Error saving team member field:', error);
        updateFieldStatus(fieldId, 'error', error instanceof Error ? error.message : 'Save failed');
      } finally {
        // Clean up
        delete pendingSaves.current[fieldId];
      }
    }, debounceMs);
    
  }, [onSave, debounceMs, updateFieldStatus]);
  
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
    setMembers(updatedMembers);
    
    try {
      await onSave(updatedMembers);
    } catch (error) {
      console.error('Error adding team member:', error);
      // Revert on error
      setMembers(membersRef.current);
    }
  }, [onSave]);
  
  // Handle removing a member (immediate save)
  const handleRemoveMember = useCallback(async (index: number) => {
    const updatedMembers = [...membersRef.current];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
    
    // Clear any pending saves for this member
    Object.keys(pendingSaves.current).forEach(fieldId => {
      if (fieldId.startsWith(`team_member_${index}_`)) {
        clearTimeout(pendingSaves.current[fieldId]);
        delete pendingSaves.current[fieldId];
      }
    });
    
    try {
      await onSave(updatedMembers);
    } catch (error) {
      console.error('Error removing team member:', error);
      // Revert on error
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
    const pendingFieldIds = Object.keys(pendingSaves.current);
    
    console.log(`Force saving ${pendingFieldIds.length} pending changes`);
    
    // Clear all timeouts and execute saves immediately
    await Promise.all(
      pendingFieldIds.map(async (fieldId) => {
        if (pendingSaves.current[fieldId]) {
          clearTimeout(pendingSaves.current[fieldId]);
          delete pendingSaves.current[fieldId];
        }
        
        updateFieldStatus(fieldId, 'saving');
        try {
          await onSave(membersRef.current);
          updateFieldStatus(fieldId, 'saved');
        } catch (error) {
          updateFieldStatus(fieldId, 'error');
        }
      })
    );
  }, [onSave, updateFieldStatus]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingSaves.current).forEach(timeout => {
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
