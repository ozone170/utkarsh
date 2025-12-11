export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/seed.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};