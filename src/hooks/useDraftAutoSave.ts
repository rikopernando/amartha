import { useEffect, useRef, useCallback } from 'react';
import { UserRole, FormData } from '../types';
import { saveDraft, loadDraft, clearDraft } from '../utils/localStorage';
import { debounce } from '../utils/debounce';

const AUTO_SAVE_DELAY = 2000; // 2 seconds

interface UseDraftAutoSaveOptions {
  role: UserRole;
  formData: FormData;
  enabled?: boolean;
}

interface UseDraftAutoSaveReturn {
  clearCurrentDraft: () => void;
  loadSavedDraft: () => FormData | null;
}

/**
 * Hook for auto-saving form data to localStorage with debouncing
 * Auto-saves every 2 seconds of inactivity
 */
export function useDraftAutoSave({
  role,
  formData,
  enabled = true,
}: UseDraftAutoSaveOptions): UseDraftAutoSaveReturn {
  // Create a stable reference to the debounced save function
  const debouncedSaveRef = useRef(
    debounce((roleToSave: UserRole, dataToSave: FormData) => {
      saveDraft(roleToSave, dataToSave);
    }, AUTO_SAVE_DELAY)
  );

  // Auto-save when formData changes (debounced)
  useEffect(() => {
    if (!enabled) return;

    debouncedSaveRef.current(role, formData);
  }, [role, formData, enabled]);

  // Clear draft for current role
  const clearCurrentDraft = useCallback(() => {
    clearDraft(role);
  }, [role]);

  // Load saved draft for current role
  const loadSavedDraft = useCallback(() => {
    return loadDraft(role);
  }, [role]);

  return {
    clearCurrentDraft,
    loadSavedDraft,
  };
}
