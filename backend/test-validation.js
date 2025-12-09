import { isAllowed } from './services/allowedList.js';

console.log('🧪 Testing Allowlist Validation\n');
console.log('=' .repeat(50));

// Test cases
const testCases = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    expected: true,
    description: 'Valid student (all 3 match)'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9999999999',
    expected: true,
    description: 'Valid student (name + email match)'
  },
  {
    name: 'sad',
    email: 'sad@gmail.com',
    phone: '56465',
    expected: false,
    description: 'Invalid student (not in list)'
  },
  {
    name: 'Jane Smith',
    email: 'wrong@email.com',
    phone: '9876543210',
    expected: true,
    description: 'Valid student (name + phone match)'
  },
  {
    name: 'Random Person',
    email: 'random@test.com',
    phone: '1111111111',
    expected: false,
    description: 'Invalid student (not in list)'
  }
];

console.log('\nRunning tests...\n');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = isAllowed({
    name: test.name,
    email: test.email,
    phone: test.phone
  });
  
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  
  if (result === test.expected) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`Test ${index + 1}: ${status}`);
  console.log(`  Description: ${test.description}`);
  console.log(`  Input: ${test.name} (${test.email}, ${test.phone})`);
  console.log(`  Expected: ${test.expected}, Got: ${result}`);
  console.log('');
});

console.log('=' .repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

if (failed === 0) {
  console.log('✅ All tests passed! Validation is working correctly.');
  console.log('\n💡 If students are still registering without validation:');
  console.log('   1. Make sure your backend server is restarted');
  console.log('   2. Check backend console logs for validation messages');
  console.log('   3. Clear browser cache and try again');
} else {
  console.log('❌ Some tests failed. Check the validation logic.');
}
