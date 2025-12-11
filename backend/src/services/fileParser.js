/**
 * File parsing service for CSV and XLSX uploads
 * Handles student data import with validation
 */

import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import fs from 'fs';
import { validateProgramYear, allowedYearsFor } from '../utils/programValidation.js';

/**
 * Normalize phone number by removing non-digits and leading zeros
 * @param {string} phone - Raw phone number
 * @returns {string} - Normalized phone number
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').replace(/^0+/, '');
}

/**
 * Parse CSV file and return structured data
 * @param {string} filePath - Path to CSV file
 * @returns {Array} - Array of parsed records
 */
export function parseCSV(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, {
      columns: true, // Use first row as column headers
      skip_empty_lines: true,
      trim: true,
      cast: true
    });
    
    return records;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
}

/**
 * Parse XLSX file and return structured data
 * @param {string} filePath - Path to XLSX file
 * @returns {Array} - Array of parsed records
 */
export function parseXLSX(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header row as keys
    const records = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // Get raw data first
      defval: '' // Default value for empty cells
    });
    
    if (records.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }
    
    // Convert to object format using first row as headers
    const headers = records[0];
    const data = records.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return data;
  } catch (error) {
    throw new Error(`XLSX parsing failed: ${error.message}`);
  }
}

/**
 * Parse uploaded file based on extension
 * @param {string} filePath - Path to uploaded file
 * @param {string} originalName - Original filename
 * @returns {Array} - Array of parsed records
 */
export function parseUploadedFile(filePath, originalName) {
  const extension = originalName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'csv':
      return parseCSV(filePath);
    case 'xlsx':
    case 'xls':
      return parseXLSX(filePath);
    default:
      throw new Error(`Unsupported file format: ${extension}. Please upload CSV or XLSX files.`);
  }
}

/**
 * Normalize and validate student record
 * @param {Object} record - Raw record from file
 * @param {string} defaultProgram - Default program if not specified
 * @returns {Object} - Normalized record with validation results
 */
export function normalizeStudentRecord(record, defaultProgram = 'MBA') {
  // Map common column variations to standard fields
  const fieldMappings = {
    name: ['name', 'student_name', 'full_name', 'Name', 'Student Name', 'Full Name'],
    email: ['email', 'email_address', 'Email', 'Email Address'],
    phone: ['phone', 'phone_number', 'mobile', 'Phone', 'Phone Number', 'Mobile'],
    program: ['program', 'course', 'branch', 'Program', 'Course', 'Branch'],
    year: ['year', 'academic_year', 'Year', 'Academic Year'],
    gender: ['gender', 'Gender'],
    section: ['section', 'Section']
  };

  const normalized = {};
  const errors = [];

  // Extract fields using mappings
  Object.keys(fieldMappings).forEach(field => {
    const possibleKeys = fieldMappings[field];
    const foundKey = possibleKeys.find(key => record.hasOwnProperty(key) && record[key] !== '');
    normalized[field] = foundKey ? String(record[foundKey]).trim() : '';
  });

  // Apply defaults
  if (!normalized.program) {
    normalized.program = defaultProgram;
  }
  if (!normalized.year) {
    normalized.year = 1;
  }

  // Normalize phone
  if (normalized.phone) {
    normalized.phone = normalizePhone(normalized.phone);
  }

  // Validate required fields
  const requiredFields = ['name', 'email', 'phone', 'program', 'year', 'gender', 'section'];
  requiredFields.forEach(field => {
    if (!normalized[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate program-year combination
  if (normalized.program && normalized.year) {
    const yearNum = Number(normalized.year);
    const programYearError = validateProgramYear(normalized.program, yearNum);
    if (programYearError) {
      errors.push(programYearError);
    } else {
      normalized.year = yearNum; // Convert to number
    }
  }

  // Validate gender
  if (normalized.gender && !['Male', 'Female', 'Other'].includes(normalized.gender)) {
    errors.push(`Invalid gender: ${normalized.gender}. Must be Male, Female, or Other`);
  }

  // Validate section
  if (normalized.section && !['A', 'B', 'C', 'D'].includes(normalized.section.toUpperCase())) {
    errors.push(`Invalid section: ${normalized.section}. Must be A, B, C, or D`);
  } else if (normalized.section) {
    normalized.section = normalized.section.toUpperCase();
  }

  // Validate email format (basic)
  if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    errors.push(`Invalid email format: ${normalized.email}`);
  }

  // Validate phone (should be 10 digits after normalization)
  if (normalized.phone && (normalized.phone.length < 10 || normalized.phone.length > 15)) {
    errors.push(`Invalid phone number: ${normalized.phone}. Should be 10-15 digits`);
  }

  return {
    data: normalized,
    errors,
    isValid: errors.length === 0,
    originalRecord: record
  };
}

/**
 * Process bulk upload data
 * @param {Array} records - Raw records from file
 * @param {string} defaultProgram - Default program for records without program
 * @returns {Object} - Processing results
 */
export function processBulkUpload(records, defaultProgram = 'MBA') {
  const results = {
    total: records.length,
    valid: [],
    invalid: [],
    duplicateEmails: [],
    duplicatePhones: [],
    summary: {
      validCount: 0,
      invalidCount: 0,
      duplicateEmailCount: 0,
      duplicatePhoneCount: 0
    }
  };

  const seenEmails = new Set();
  const seenPhones = new Set();

  records.forEach((record, index) => {
    const normalized = normalizeStudentRecord(record, defaultProgram);
    normalized.rowIndex = index + 2; // +2 because index starts at 0 and we skip header row

    if (!normalized.isValid) {
      results.invalid.push(normalized);
      results.summary.invalidCount++;
      return;
    }

    // Check for duplicate emails within the file
    if (seenEmails.has(normalized.data.email)) {
      normalized.errors.push('Duplicate email within file');
      results.duplicateEmails.push(normalized);
      results.summary.duplicateEmailCount++;
      return;
    }
    seenEmails.add(normalized.data.email);

    // Check for duplicate phones within the file
    if (seenPhones.has(normalized.data.phone)) {
      normalized.errors.push('Duplicate phone within file');
      results.duplicatePhones.push(normalized);
      results.summary.duplicatePhoneCount++;
      return;
    }
    seenPhones.add(normalized.data.phone);

    results.valid.push(normalized);
    results.summary.validCount++;
  });

  return results;
}

/**
 * Generate sample CSV template
 * @returns {string} - CSV template content
 */
export function generateCSVTemplate() {
  const headers = ['name', 'email', 'phone', 'program', 'year', 'gender', 'section'];
  const sampleData = [
    ['John Doe', 'john.doe@example.com', '9876543210', 'MBA', '1', 'Male', 'A'],
    ['Jane Smith', 'jane.smith@example.com', '9876543211', 'B.Tech', '2', 'Female', 'B'],
    ['Alex Johnson', 'alex.johnson@example.com', '9876543212', 'M.Tech', '1', 'Other', 'C']
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}