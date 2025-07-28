import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    rules: {
      'import-x/export': 'error',
      'import-x/first': 'error',
      'import-x/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          distinctGroup: false,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['src/**/*'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', {
        devDependencies: false,
      }],
    },
  },
]);
