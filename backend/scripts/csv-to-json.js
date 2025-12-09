import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert CSV to JSON for allowed students
 * Usage: node scripts/csv-to-json.js <csv-file-path>
 */

function csvToJson(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Find column indices
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const phoneIdx = headers.findIndex(h => h.includes('phone'));

    if (nameIdx === -1 || emailIdx === -1) {
      throw new Error('CSV must have at least "name" and "email" columns');
    }

    // Parse data rows
    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      const student = {
        name: values[nameIdx] || '',
        email: values[emailIdx] || '',
        phone: phoneIdx !== -1 ? values[phoneIdx] : ''
      };

      if (student.name && student.email) {
        students.push(student);
      }
    }

    const output = {
      students,
      lastUpdated: new Date().toISOString(),
      source: 'CSV Import',
      totalCount: students.length,
      note: 'Students are validated by name, email, and phone. Event ID is auto-generated upon registration.'
    };

    // Write to JSON file
    const outputPath = path.join(__dirname, '../data/allowed_students.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✓ Successfully converted ${students.length} students to JSON`);
    console.log(`✓ Output saved to: ${outputPath}`);
    
    return output;
  } catch (error) {
    console.error('Error converting CSV to JSON:', error.message);
    process.exit(1);
  }
}

// CLI execution
if (process.argv.length < 3) {
  console.error('Usage: node csv-to-json.js <csv-file-path>');
  process.exit(1);
}

const csvFilePath = process.argv[2];
if (!fs.existsSync(csvFilePath)) {
  console.error(`Error: File not found: ${csvFilePath}`);
  process.exit(1);
}

csvToJson(csvFilePath);
