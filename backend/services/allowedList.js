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
    const filePath = path.join(__dirname, 'students.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    allowedStudents = Array.isArray(parsed) ? parsed : [];
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
 * Check if a student is allowed to register based on phone number
 * @param {string} phone - Student phone number
 * @returns {boolean} - True if allowed, false otherwise
 */
export const isAllowed = (phone) => {
  if (!phone) {
    console.log('❌ No phone number provided');
    return false;
  }

  // Reload if not loaded yet
  if (allowedStudents.length === 0 && !lastLoaded) {
    loadAllowedStudents();
  }

  // Normalize phone number (remove spaces)
  const normalizedPhone = phone.replace(/\s/g, '');
  
  console.log(`🔍 Checking allowlist for phone: ${normalizedPhone}`);
  console.log(`📋 Total allowed students: ${allowedStudents.length}`);

  // Check if phone number exists in the allowlist
  const found = allowedStudents.find(allowed => {
    const allowedPhone = allowed.phone?.replace(/\s/g, '');
    return allowedPhone === normalizedPhone;
  });

  if (found) {
    console.log(`✅ Phone number ALLOWED: ${normalizedPhone} (${found.name})`);
  } else {
    console.log(`❌ Phone number NOT ALLOWED: ${normalizedPhone}`);
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
