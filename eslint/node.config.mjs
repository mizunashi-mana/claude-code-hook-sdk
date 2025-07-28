import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    rules: {
      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-callback-literal': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/process-exit-as-throw': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Use eslint-plugin-import-x for TypeScript imports
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
]);
