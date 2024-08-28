/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  transform: {
    '^.+.tsx?$': ['ts-jest', {
      tsconfig: './lib/tsconfig.json',
      diagnostics: {
        ignoreCodes: [ 'TS151001' ],
      },
    }],
  },
};
