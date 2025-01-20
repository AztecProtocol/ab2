import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
      }],
      '@typescript-eslint/no-unused-vars': ['error', { 
        'varsIgnorePattern': 'react|nodePolyfills|nodeStdlibBrowser|resolve|aztecVersion',
        'argsIgnorePattern': '^_'
      }],
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.js', 'vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'off',
    },
  },
];
