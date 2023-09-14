module.exports = {
  maxConcurrency: 10,
  transform: {
    '\\.(js)$': 'babel-jest',
  },
  collectCoverageFrom: ['lib/**/*.js'],
  // coverageReporters: ['json', 'html'],
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.afterEnv.js'],
  roots: ['<rootDir>/lib/'],
  testMatch: ['**/*.spec.js'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  clearMocks: true,
};
