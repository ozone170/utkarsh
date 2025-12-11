/**
 * Unit tests for file parser utilities
 */

import { describe, it, expect } from '@jest/globals';
import { 
  normalizePhone, 
  normalizeStudentRecord,
  processBulkUpload 
} from '../../src/services/fileParser.js';

describe('File Parser Utils', () => {
  describe('normalizePhone', () => {
    it('should remove non-digits', () => {
      expect(normalizePhone('(123) 456-7890')).toBe('1234567890');
      expect(normalizePhone('+91 98765 43210')).toBe('919876543210');
      expect(normalizePhone('123-456-7890')).toBe('1234567890');
    });

    it('should remove leading zeros', () => {
      expect(normalizePhone('0123456789')).toBe('123456789');
      expect(normalizePhone('00919876543210')).toBe('919876543210');
    });

    it('should handle empty/null values', () => {
      expect(normalizePhone('')).toBe('');
      expect(normalizePhone(null)).toBe('');
      expect(normalizePhone(undefined)).toBe('');
    });

    it('should handle numeric input', () => {
      expect(normalizePhone(1234567890)).toBe('1234567890');
    });
  });

  describe('normalizeStudentRecord', () => {
    const validRecord = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      program: 'MBA',
      year: '1',
      gender: 'Male',
      section: 'A'
    };

    it('should normalize valid record', () => {
      const result = normalizeStudentRecord(validRecord);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data.name).toBe('John Doe');
      expect(result.data.year).toBe(1); // Should be converted to number
      expect(result.data.section).toBe('A');
    });

    it('should handle missing required fields', () => {
      const incompleteRecord = {
        name: 'John Doe',
        email: 'john@example.com'
        // Missing phone, program, year, gender, section
      };

      const result = normalizeStudentRecord(incompleteRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('phone'))).toBe(true);
    });

    it('should validate program-year combinations', () => {
      const invalidRecord = {
        ...validRecord,
        program: 'MBA',
        year: '3' // Invalid for MBA
      };

      const result = normalizeStudentRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Year 3 is not valid for MBA'))).toBe(true);
    });

    it('should normalize phone numbers', () => {
      const recordWithFormattedPhone = {
        ...validRecord,
        phone: '+91 98765-43210'
      };

      const result = normalizeStudentRecord(recordWithFormattedPhone);
      
      expect(result.data.phone).toBe('919876543210');
    });

    it('should validate email format', () => {
      const recordWithInvalidEmail = {
        ...validRecord,
        email: 'invalid-email'
      };

      const result = normalizeStudentRecord(recordWithInvalidEmail);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid email format'))).toBe(true);
    });

    it('should apply default program', () => {
      const recordWithoutProgram = {
        ...validRecord,
        program: ''
      };

      const result = normalizeStudentRecord(recordWithoutProgram, 'B.Tech');
      
      expect(result.data.program).toBe('B.Tech');
    });

    it('should handle field mappings', () => {
      const recordWithVariantFields = {
        'Student Name': 'Jane Doe',
        'Email Address': 'jane@example.com',
        'Phone Number': '9876543211',
        'Course': 'MBA',
        'Academic Year': '2',
        'Gender': 'Female',
        'Section': 'b'
      };

      const result = normalizeStudentRecord(recordWithVariantFields);
      
      expect(result.data.name).toBe('Jane Doe');
      expect(result.data.email).toBe('jane@example.com');
      expect(result.data.program).toBe('MBA');
      expect(result.data.section).toBe('B'); // Should be uppercase
    });
  });

  describe('processBulkUpload', () => {
    const validRecords = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        program: 'MBA',
        year: '1',
        gender: 'Male',
        section: 'A'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        program: 'B.Tech',
        year: '2',
        gender: 'Female',
        section: 'B'
      }
    ];

    it('should process valid records', () => {
      const result = processBulkUpload(validRecords);
      
      expect(result.total).toBe(2);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(0);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    it('should detect duplicate emails', () => {
      const recordsWithDuplicateEmail = [
        ...validRecords,
        {
          name: 'John Clone',
          email: 'john@example.com', // Duplicate email
          phone: '9876543212',
          program: 'MBA',
          year: '1',
          gender: 'Male',
          section: 'A'
        }
      ];

      const result = processBulkUpload(recordsWithDuplicateEmail);
      
      expect(result.summary.duplicateEmailCount).toBe(1);
      expect(result.duplicateEmails).toHaveLength(1);
    });

    it('should detect duplicate phones', () => {
      const recordsWithDuplicatePhone = [
        ...validRecords,
        {
          name: 'John Clone',
          email: 'johnclone@example.com',
          phone: '9876543210', // Duplicate phone
          program: 'MBA',
          year: '1',
          gender: 'Male',
          section: 'A'
        }
      ];

      const result = processBulkUpload(recordsWithDuplicatePhone);
      
      expect(result.summary.duplicatePhoneCount).toBe(1);
      expect(result.duplicatePhones).toHaveLength(1);
    });

    it('should handle mixed valid/invalid records', () => {
      const mixedRecords = [
        ...validRecords,
        {
          name: 'Invalid User',
          email: 'invalid-email', // Invalid email
          phone: '123', // Invalid phone
          program: 'MBA',
          year: '5', // Invalid year for MBA
          gender: 'Unknown', // Invalid gender
          section: 'Z' // Invalid section
        }
      ];

      const result = processBulkUpload(mixedRecords);
      
      expect(result.total).toBe(3);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(1);
      expect(result.invalid[0].errors.length).toBeGreaterThan(0);
    });
  });
});