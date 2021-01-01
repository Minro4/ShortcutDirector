/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  mapCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
};
