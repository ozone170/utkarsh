/**
 * Program-aware year selection utilities
 * Handles different year options based on program type
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
export function getYearOptions(program) {
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
  const allowedYears = getYearOptions(program);
  return allowedYears.includes(Number(year));
}

/**
 * Get program display options for dropdowns
 * @returns {Array} - Array of program options
 */
export function getProgramOptions() {
  return [
    { value: PROGRAMS.MBA, label: 'MBA - Master of Business Administration' },
    { value: PROGRAMS.BTECH, label: 'B.Tech - Bachelor of Technology' },
    { value: PROGRAMS.MTECH, label: 'M.Tech - Master of Technology' },
    { value: PROGRAMS.BBA, label: 'BBA - Bachelor of Business Administration' },
    { value: PROGRAMS.MCA, label: 'MCA - Master of Computer Applications' },
    { value: PROGRAMS.OTHER, label: 'Other Program' }
  ];
}

/**
 * Get year display text
 * @param {number} year - Year number
 * @returns {string} - Display text for year
 */
export function getYearDisplayText(year) {
  const yearMap = {
    1: '1st Year',
    2: '2nd Year', 
    3: '3rd Year',
    4: '4th Year'
  };
  return yearMap[year] || `${year}th Year`;
}