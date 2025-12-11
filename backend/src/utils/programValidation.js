/**
 * Program-aware validation utilities for backend
 */

export const PROGRAMS = {
  MBA: 'MBA',
  BTECH: 'B.Tech',
  MTECH: 'M.Tech',
  BBA: 'BBA',
  MCA: 'MCA',
  OTHER: 'Other'
};

export const YEAR_OPTIONS = {
  default: [1, 2, 3, 4],
  mba: [1, 2],
  'b.tech': [1, 2, 3, 4],
  'm.tech': [1, 2],
  bba: [1, 2, 3],
  mca: [1, 2, 3],
  other: [1, 2, 3, 4]
};

/**
 * Get allowed years for a specific program
 * @param {string} program - Program name
 * @returns {number[]} - Array of allowed years
 */
export function allowedYearsFor(program) {
  if (!program) return YEAR_OPTIONS.default;
  
  const key = String(program).trim().toLowerCase();
  return YEAR_OPTIONS[key] || YEAR_OPTIONS.default;
}

/**
 * Validate if a year is allowed for a program
 * @param {string} program - Program name
 * @param {number} year - Year to validate
 * @returns {boolean} - True if year is allowed
 */
export function isValidYearForProgram(program, year) {
  const allowedYears = allowedYearsFor(program);
  return allowedYears.includes(Number(year));
}

/**
 * Validate program-year combination and return error if invalid
 * @param {string} program - Program name
 * @param {number} year - Year to validate
 * @returns {string|null} - Error message or null if valid
 */
export function validateProgramYear(program, year) {
  if (!program) {
    return 'Program is required';
  }
  
  if (!year || year < 1 || year > 4) {
    return 'Year must be between 1 and 4';
  }
  
  if (!isValidYearForProgram(program, year)) {
    const allowedYears = allowedYearsFor(program);
    return `Year ${year} is not valid for ${program}. Allowed years: ${allowedYears.join(', ')}`;
  }
  
  return null;
}

/**
 * Get all valid programs
 * @returns {string[]} - Array of valid program names
 */
export function getValidPrograms() {
  return Object.values(PROGRAMS);
}