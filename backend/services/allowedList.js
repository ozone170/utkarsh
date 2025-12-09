import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let allowedStudents = [];
let lastLoaded = null;

/**
 * Load allowed students from JSON file
 */
export const loadAllowedStudents = () => {
  try {
    const filePath = path.join(__dirname, '../data/allowed_students.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    allowedStudents = parsed.students || [];
    lastLoaded = new Date();
    console.log(`✓ Loaded ${allowedStudents.length} allowed students`);
    return allowedStudents;
  } catch (error) {
    console.error('Error loading allowed students:', error.message);
    allowedStudents = [];
    return [];
  }
};

/**
 * Check if a student is allowed to register
 * @param {Object} student - Student details
 * @param {string} student.name - Student name
 * @param {string} student.email - Student email
 * @param {string} student.phone - Student phone
 * @returns {boolean} - True if allowed, false otherwise
 */
export const isAllowed = (student) => {
  if (!student) {
    console.log('❌ No student data provided');
    return false;
  }

  // Reload if not loaded yet
  if (allowedStudents.length === 0 && !lastLoaded) {
    loadAllowedStudents();
  }

  console.log(`🔍 Checking allowlist for: ${student.name} (${student.email}, ${student.phone})`);
  console.log(`📋 Total allowed students: ${allowedStudents.length}`);

  // Check if student matches any entry in the allowlist
  const found = allowedStudents.find(allowed => {
    const nameMatch = allowed.name?.toLowerCase().trim() === student.name?.toLowerCase().trim();
    const emailMatch = allowed.email?.toLowerCase().trim() === student.email?.toLowerCase().trim();
    const phoneMatch = allowed.phone?.replace(/\s/g, '') === student.phone?.replace(/\s/g, '');

    // Student must match at least 2 criteria (name + email OR name + phone OR email + phone)
    const matches = [nameMatch, emailMatch, phoneMatch].filter(Boolean).length;
    
    if (matches > 0) {
      console.log(`  Comparing with: ${allowed.name} (${allowed.email}, ${allowed.phone})`);
      console.log(`    Name match: ${nameMatch}, Email match: ${emailMatch}, Phone match: ${phoneMatch}`);
      console.log(`    Total matches: ${matches}/3`);
    }
    
    return matches >= 2;
  });

  if (found) {
    console.log(`✅ Student ALLOWED: ${student.name}`);
  } else {
    console.log(`❌ Student NOT ALLOWED: ${student.name}`);
  }

  return !!found;
};

/**
 * Get all allowed students
 */
export const getAllowedStudents = () => {
  if (allowedStudents.length === 0 && !lastLoaded) {
    loadAllowedStudents();
  }
  return allowedStudents;
};

/**
 * Reload allowed students (useful for updates)
 */
export const reloadAllowedStudents = () => {
  return loadAllowedStudents();
};

// Auto-load on module import
loadAllowedStudents();
