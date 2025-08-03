import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },
      parserOptions: {
        sourceType: 'module',
        projectService: false,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['{src,test,script}/**/*.{ts,tsx}', '.*/**/*.{ts,tsx}', '*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['example/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: './example',
      },
    },
  },
]);
