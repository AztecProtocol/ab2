import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/setupTests.ts'],
  moduleNameMapper: {
    '^@aztec/(.*)$': '<rootDir>/node_modules/@aztec/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'frontend/tsconfig.json'
    }],
  },
  roots: ['<rootDir>/frontend'],
  modulePaths: ['<rootDir>/frontend/src'],
  testMatch: ['<rootDir>/frontend/src/**/__tests__/**/*.+(ts|tsx|js)', '<rootDir>/frontend/src/**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 200000,
};

export default config;