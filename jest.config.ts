/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@config/email$': '<rootDir>/__mocks__/@config/email.ts',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@shared/cache/RedisCache$':
      '<rootDir>/__mocks__/@shared/cache/RedisCache.ts',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.ts',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'node',
          target: 'ES2020',
          lib: ['ES2020'],
          esModuleInterop: true,
          resolveJsonModule: true,
          allowJs: true,
        },
      },
    ],
  },
  collectCoverageFrom: ['<rootDir>/src/modules/**/services/*.ts'],
  coverageReporters: ['lcov', 'text'],
  testTimeout: 10000,
  injectGlobals: true,
};

export default config;
