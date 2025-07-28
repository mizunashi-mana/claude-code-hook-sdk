import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    rules: {
      'promise/always-return': [
        'error',
        {
          ignoreLastCallback: true,
        },
      ],
      'promise/no-promise-in-callback': 'error',
    },
  },
]);
