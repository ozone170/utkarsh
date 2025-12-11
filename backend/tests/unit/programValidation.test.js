/**
 * Unit tests for program validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import { 
  allowedYearsFor, 
  isValidYearForProgram, 
  validateProgramYear,
  getValidPrograms 
} from '../../src/utils/programValidation.js';

describe('Program Validation Utils', () => {
  describe('allowedYearsFor', () => {
    it('should return correct years for MBA', () => {
      expect(allowedYearsFor('MBA')).toEqual([1, 2]);
      expect(allowedYearsFor('mba')).toEqual([1, 2]);
    });

    it('should return correct years for B.Tech', () => {
      expect(allowedYearsFor('B.Tech')).toEqual([1, 2, 3, 4]);
      expect(allowedYearsFor('b.tech')).toEqual([1, 2, 3, 4]);
    });

    it('should return correct years for M.Tech', () => {
      expect(allowedYearsFor('M.Tech')).toEqual([1, 2]);
      expect(allowedYearsFor('m.tech')).toEqual([1, 2]);
    });

    it('should return default years for unknown program', () => {
      expect(allowedYearsFor('Unknown')).toEqual([1, 2, 3, 4]);
      expect(allowedYearsFor('')).toEqual([1, 2, 3, 4]);
      expect(allowedYearsFor(null)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('isValidYearForProgram', () => {
    it('should validate MBA years correctly', () => {
      expect(isValidYearForProgram('MBA', 1)).toBe(true);
      expect(isValidYearForProgram('MBA', 2)).toBe(true);
      expect(isValidYearForProgram('MBA', 3)).toBe(false);
      expect(isValidYearForProgram('MBA', 4)).toBe(false);
    });

    it('should validate B.Tech years correctly', () => {
      expect(isValidYearForProgram('B.Tech', 1)).toBe(true);
      expect(isValidYearForProgram('B.Tech', 2)).toBe(true);
      expect(isValidYearForProgram('B.Tech', 3)).toBe(true);
      expect(isValidYearForProgram('B.Tech', 4)).toBe(true);
      expect(isValidYearForProgram('B.Tech', 5)).toBe(false);
    });

    it('should handle string years', () => {
      expect(isValidYearForProgram('MBA', '1')).toBe(true);
      expect(isValidYearForProgram('MBA', '3')).toBe(false);
    });
  });

  describe('validateProgramYear', () => {
    it('should return null for valid combinations', () => {
      expect(validateProgramYear('MBA', 1)).toBe(null);
      expect(validateProgramYear('MBA', 2)).toBe(null);
      expect(validateProgramYear('B.Tech', 4)).toBe(null);
    });

    it('should return error for invalid combinations', () => {
      const error = validateProgramYear('MBA', 3);
      expect(error).toContain('Year 3 is not valid for MBA');
      expect(error).toContain('Allowed years: 1, 2');
    });

    it('should return error for missing program', () => {
      const error = validateProgramYear('', 1);
      expect(error).toBe('Program is required');
    });

    it('should return error for invalid year', () => {
      const error = validateProgramYear('MBA', 0);
      expect(error).toBe('Year must be between 1 and 4');
    });
  });

  describe('getValidPrograms', () => {
    it('should return all valid programs', () => {
      const programs = getValidPrograms();
      expect(programs).toContain('MBA');
      expect(programs).toContain('B.Tech');
      expect(programs).toContain('M.Tech');
      expect(programs).toContain('BBA');
      expect(programs).toContain('MCA');
      expect(programs).toContain('Other');
    });
  });
});