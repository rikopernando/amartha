import { type UserRole, type FormData } from "../types";

const DRAFT_KEY_PREFIX = "draft_";

/**
 * Get the localStorage key for a specific role
 */
export function getDraftKey(role: UserRole): string {
  return `${DRAFT_KEY_PREFIX}${role}`;
}

/**
 * Save draft data to localStorage for a specific role
 */
export function saveDraft(role: UserRole, data: FormData): void {
  try {
    const key = getDraftKey(role);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save draft to localStorage:", error);
  }
}

/**
 * Load draft data from localStorage for a specific role
 */
export function loadDraft(role: UserRole): FormData | null {
  try {
    const key = getDraftKey(role);
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as FormData;
  } catch (error) {
    console.error("Failed to load draft from localStorage:", error);
    return null;
  }
}

/**
 * Clear draft data from localStorage for a specific role
 */
export function clearDraft(role: UserRole): void {
  try {
    const key = getDraftKey(role);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear draft from localStorage:", error);
  }
}

/**
 * Check if a draft exists for a specific role
 */
export function hasDraft(role: UserRole): boolean {
  try {
    const key = getDraftKey(role);
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error("Failed to check draft in localStorage:", error);
    return false;
  }
}
