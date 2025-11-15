import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isRequired,
  minLength,
  maxLength,
  getEmailError,
  getRequiredError,
  validateStep1,
  validateStep2,
} from './validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
    });
  });

  describe('isRequired', () => {
    it('should return true for non-empty strings', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired('  text  ')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should return true when length meets minimum', () => {
      expect(minLength('test', 3)).toBe(true);
      expect(minLength('test', 4)).toBe(true);
    });

    it('should return false when length is below minimum', () => {
      expect(minLength('ab', 3)).toBe(false);
      expect(minLength('', 1)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should return true when length is within maximum', () => {
      expect(maxLength('test', 5)).toBe(true);
      expect(maxLength('test', 4)).toBe(true);
      expect(maxLength('', 10)).toBe(true);
    });

    it('should return false when length exceeds maximum', () => {
      expect(maxLength('testing', 5)).toBe(false);
    });
  });

  describe('getEmailError', () => {
    it('should return null for valid email', () => {
      expect(getEmailError('test@example.com')).toBeNull();
    });

    it('should return error for empty email', () => {
      expect(getEmailError('')).toBe('Email is required');
    });

    it('should return error for invalid email', () => {
      expect(getEmailError('invalid')).toBe('Please enter a valid email address');
    });
  });

  describe('getRequiredError', () => {
    it('should return null for non-empty value', () => {
      expect(getRequiredError('test', 'Field')).toBeNull();
    });

    it('should return error message for empty value', () => {
      expect(getRequiredError('', 'Full Name')).toBe('Full Name is required');
      expect(getRequiredError(null, 'Department')).toBe('Department is required');
      expect(getRequiredError(undefined, 'Role')).toBe('Role is required');
    });
  });

  describe('validateStep1', () => {
    it('should return valid for complete data', () => {
      const result = validateStep1({
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Admin',
        employeeId: 'ENG-001',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for missing fields', () => {
      const result = validateStep1({});

      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe('Full Name is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.department).toBe('Department is required');
      expect(result.errors.role).toBe('Role is required');
      expect(result.errors.employeeId).toBe('Employee ID is required');
    });

    it('should return error for invalid email', () => {
      const result = validateStep1({
        fullName: 'John Doe',
        email: 'invalid-email',
        department: 'Engineering',
        role: 'Admin',
        employeeId: 'ENG-001',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });
  });

  describe('validateStep2', () => {
    it('should return valid for complete data', () => {
      const result = validateStep2({
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for missing fields', () => {
      const result = validateStep2({});

      expect(result.isValid).toBe(false);
      expect(result.errors.employmentType).toBe('Employment Type is required');
      expect(result.errors.officeLocation).toBe('Office Location is required');
    });

    it('should allow missing photo and notes (optional fields)', () => {
      const result = validateStep2({
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
        // photo and notes are optional
      });

      expect(result.isValid).toBe(true);
    });
  });
});
