/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a field is not empty
 */
export function isRequired(value: string | undefined | null): boolean {
  if (value === undefined || value === null) return false;
  return value.trim().length > 0;
}

/**
 * Validates minimum length
 */
export function minLength(value: string, min: number): boolean {
  if (!value) return false;
  return value.trim().length >= min;
}

/**
 * Validates maximum length
 */
export function maxLength(value: string, max: number): boolean {
  if (!value) return true; // Empty is valid for max length
  return value.trim().length <= max;
}

/**
 * Get email validation error message
 */
export function getEmailError(email: string): string | null {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
}

/**
 * Get required field error message
 */
export function getRequiredError(value: string | undefined | null, fieldName: string): string | null {
  if (!isRequired(value)) return `${fieldName} is required`;
  return null;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates Step 1 (Basic Info) fields
 */
export function validateStep1(data: {
  fullName?: string;
  email?: string;
  department?: string;
  role?: string;
  employeeId?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Full Name validation
  const fullNameError = getRequiredError(data.fullName, 'Full Name');
  if (fullNameError) errors.fullName = fullNameError;

  // Email validation
  const emailError = getEmailError(data.email || '');
  if (emailError) errors.email = emailError;

  // Department validation
  const deptError = getRequiredError(data.department, 'Department');
  if (deptError) errors.department = deptError;

  // Role validation
  const roleError = getRequiredError(data.role, 'Role');
  if (roleError) errors.role = roleError;

  // Employee ID validation
  const empIdError = getRequiredError(data.employeeId, 'Employee ID');
  if (empIdError) errors.employeeId = empIdError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Step 2 (Details) fields
 */
export function validateStep2(data: {
  employmentType?: string;
  officeLocation?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Employment Type validation
  const empTypeError = getRequiredError(data.employmentType, 'Employment Type');
  if (empTypeError) errors.employmentType = empTypeError;

  // Office Location validation
  const locationError = getRequiredError(data.officeLocation, 'Office Location');
  if (locationError) errors.officeLocation = locationError;

  // Note: Photo and Notes are optional

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
