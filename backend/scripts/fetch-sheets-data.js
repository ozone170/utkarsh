import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetch data from Google Sheets (published as CSV)
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Click File → Share → Publish to web
 * 3. Choose "Comma-separated values (.csv)" format
 * 4. Copy the published URL
 * 5. Replace the SHEET_ID in the URLs below
 */

const SHEETS_CONFIG = {
  students: {
    // Replace with your actual Google Sheets CSV export URL
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQps_fE_rvdDjAfyCMROrF5OvcFkRUhCcchiCsqbguLTDgGGuMj4Uj7blpTCBJbs0-DkZSmpjGgHZb8/pub?gid=0&single=true&output=csv',
    outputFile: '../data/allowed_students.json'
  },
  landing: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRG3Nz8LmHjbBkADWIJhuyymG8hDyrvwmcdnW9l1rZYeNXfH1EVZoQwLJqIvZaODEWbYEBWcPKQ4cuX/pub?gid=0&single=true&output=csv',
    outputFile: '../data/landing_content.json'
  }
};

/**
 * Fetch CSV data from URL
 */
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parse CSV to JSON for students
 */
function parseStudentsCSV(csvData) {
  const lines = csvData.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  console.log('📋 CSV Headers:', headers);
  
  // Find column indices
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
  const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact'));

  if (nameIdx === -1) {
    throw new Error('CSV must have a "name" column');
  }

  console.log(`📍 Column indices - Name: ${nameIdx}, Email: ${emailIdx}, Phone: ${phoneIdx}`);

  // Parse data rows
  const students = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    
    const student = {
      name: values[nameIdx] || '',
      email: emailIdx !== -1 ? (values[emailIdx] || '') : '',
      phone: phoneIdx !== -1 ? (values[phoneIdx] || '') : ''
    };

    // Only add if name exists
    if (student.name) {
      students.push(student);
    }
  }

  return {
    students,
    lastUpdated: new Date().toISOString(),
    source: 'Google Sheets (Auto-fetched)',
    totalCount: students.length,
    note: 'Students are validated by name, email, and phone. Must match at least 2 out of 3 criteria.'
  };
}

/**
 * Main function to fetch and convert students data
 */
async function fetchStudentsData() {
  try {
    console.log('🔄 Fetching students data from Google Sheets...');
    
    const csvData = await fetchCSV(SHEETS_CONFIG.students.url);
    console.log(`✓ Fetched ${csvData.length} bytes of CSV data`);
    
    const jsonData = parseStudentsCSV(csvData);
    console.log(`✓ Parsed ${jsonData.students.length} students`);
    
    // Save to file
    const outputPath = path.join(__dirname, SHEETS_CONFIG.students.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`✓ Saved to ${outputPath}`);
    
    // Display first few students
    console.log('\n📋 Sample students:');
    jsonData.students.slice(0, 5).forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.name} (${s.email}, ${s.phone})`);
    });
    
    if (jsonData.students.length > 5) {
      console.log(`  ... and ${jsonData.students.length - 5} more`);
    }
    
    return jsonData;
  } catch (error) {
    console.error('❌ Error fetching students data:', error.message);
    throw error;
  }
}

/**
 * Parse CSV to JSON for landing page
 */
function parseLandingCSV(csvData) {
  const lines = csvData.split('\n').filter(line => line.trim());
  
  // Simple key-value parsing for landing page content
  const content = {
    hero: {
      title: 'UTKARSH',
      subtitle: 'MBA Fresher Event 2025',
      description: 'Welcome to the most exciting MBA fresher orientation event!',
      navigation: [
        {
          label: 'Student Registration',
          link: '/register',
          icon: '🎓'
        },
        {
          label: 'Admin Login',
          link: '/login',
          icon: '👨‍💼'
        }
      ]
    },
    sections: [],
    lastUpdated: new Date().toISOString(),
    source: 'Google Sheets (Auto-fetched)'
  };

  // Parse sections from CSV if available
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length >= 2 && values[0] && values[1]) {
      content.sections.push({
        id: values[0].toLowerCase().replace(/\s+/g, '-'),
        title: values[0],
        content: values[1],
        icon: values[2] || '✨'
      });
    }
  }

  return content;
}

/**
 * Fetch landing page content
 */
async function fetchLandingData() {
  try {
    console.log('\n🔄 Fetching landing page content from Google Sheets...');
    
    const csvData = await fetchCSV(SHEETS_CONFIG.landing.url);
    const jsonData = parseLandingCSV(csvData);
    
    const outputPath = path.join(__dirname, SHEETS_CONFIG.landing.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`✓ Saved landing content to ${outputPath}`);
    
    return jsonData;
  } catch (error) {
    console.error('⚠️  Could not fetch landing page content:', error.message);
    console.log('   Using default landing page content');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Google Sheets data fetch...\n');
  
  try {
    // Fetch students data (required)
    await fetchStudentsData();
    
    // Fetch landing page content (optional)
    await fetchLandingData();
    
    console.log('\n✅ All data fetched successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend server: npm run dev');
    console.log('   2. Test registration with student data from your sheet');
    console.log('   3. Check backend console for validation logs');
    
  } catch (error) {
    console.error('\n❌ Failed to fetch data:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Google Sheet is published to web as CSV');
    console.log('   2. Check the sheet URL in this script');
    console.log('   3. Verify your sheet has columns: name, email, phone');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fetchStudentsData, fetchLandingData };
