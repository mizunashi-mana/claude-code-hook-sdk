import { defineConfig } from 'eslint/config';

const restrictedGlobals = {
  window: {
    message: 'Use with extreme caution. Minimize usage locations',
  },
  document: {
    message: 'Use with extreme caution. Prefer React APIs and minimize usage locations',
  },
  crypto: {
    message:
      'Many features are only available over HTTPS. Use with caution and minimize usage locations for easier fallbacks',
  },
  navigator: {
    message:
      'Many features are only available over HTTPS. Use with caution and minimize usage locations for easier fallbacks',
  },
};

export default defineConfig([
  {
    rules: {
      'complexity': [
        'error',
        {
          variant: 'modified',
          max: 20,
        },
      ],
      'eqeqeq': ['error', 'always'],
      'no-cond-assign': ['error', 'always'],
      'no-inner-declarations': [
        'error',
        'both',
        {
          blockScopedFunctions: 'disallow',
        },
      ],
      'no-restricted-globals': ['error', ...buildNoRestrictedRule(['window', 'document', 'crypto', 'navigator'])],
      'accessor-pairs': [
        'error',
        {
          setWithoutGet: true,
          getWithoutSet: false,
          enforceForClassMembers: true,
        },
      ],
      'array-callback-return': [
        'error',
        {
          allowImplicit: false,
          allowVoid: false,
          checkForEach: false,
        },
      ],
      'consistent-this': ['error', 'that'],
      'constructor-super': ['error'],
      'curly': ['error', 'multi-line'],
      'default-case-last': ['error'],
      'for-direction': ['error'],
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'guard-for-in': ['error'],
      'max-depth': ['error', { max: 5 }],
      'max-lines': [
        'error',
        { max: 450, skipBlankLines: true, skipComments: true },
      ],
      'max-nested-callbacks': [
        'error',
        { max: 3 },
      ],
      'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],
      'no-alert': ['error'],
      'no-async-promise-executor': ['error'],
      'no-caller': ['error'],
      'no-case-declarations': ['error'],
      'no-class-assign': ['error'],
      'no-compare-neg-zero': ['error'],
      'no-console': ['error'],
      'no-const-assign': ['error'],
      'no-constant-binary-expression': ['error'],
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-constructor-return': ['error'],
      'no-control-regex': ['error'],
      'no-debugger': ['error'],
      'no-delete-var': ['error'],
      'no-dupe-args': ['error'],
      'no-dupe-else-if': ['error'],
      'no-dupe-keys': ['error'],
      'no-duplicate-case': ['error'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-character-class': ['error'],
      'no-empty-pattern': ['error'],
      'no-empty-static-block': ['error'],
      'no-eval': ['error'],
      'no-ex-assign': ['error'],
      'no-extend-native': ['error'],
      'no-extra-bind': ['error'],
      'no-extra-boolean-cast': ['error'],
      'no-fallthrough': ['error'],
      'no-func-assign': ['error'],
      'no-global-assign': ['error'],
      'no-implicit-globals': ['error'],
      'no-import-assign': ['error'],
      'no-invalid-regexp': ['error'],
      'no-irregular-whitespace': ['error'],
      'no-iterator': ['error'],
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': ['error'],
      'no-loss-of-precision': ['error'],
      'no-misleading-character-class': ['error'],
      'no-multi-str': ['error'],
      'no-new': ['error'],
      'no-new-func': ['error'],
      'no-new-native-nonconstructor': ['error'],
      'no-new-wrappers': ['error'],
      'no-obj-calls': ['error'],
      'no-object-constructor': ['error'],
      'no-octal': ['error'],
      'no-octal-escape': ['error'],
      'no-proto': ['error'],
      'no-prototype-builtins': ['error'],
      'no-regex-spaces': ['error'],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./', '../'],
              message:
                'Use absolute paths starting with @',
            },
          ],
        },
      ],
      'no-return-assign': ['error', 'always'],
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': ['error'],
      'no-sequences': [
        'error',
        {
          allowInParentheses: false,
        },
      ],
      'no-shadow-restricted-names': ['error'],
      'no-sparse-arrays': ['error'],
      'no-template-curly-in-string': ['error'],
      'no-this-before-super': ['error'],
      'no-unexpected-multiline': ['error'],
      'no-unmodified-loop-condition': ['error'],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable': ['error'],
      'no-unreachable-loop': ['error'],
      'no-unsafe-finally': ['error'],
      'no-unsafe-negation': ['error'],
      'no-useless-backreference': ['error'],
      'no-useless-call': ['error'],
      'no-useless-catch': ['error'],
      'no-useless-computed-key': ['error'],
      'no-useless-escape': ['error'],
      'no-useless-rename': ['error'],
      'no-var': ['error'],
      'no-void': ['error', { allowAsStatement: true }],
      'no-with': ['error'],
      'object-shorthand': [
        'error',
        'properties',
        {
          avoidQuotes: true,
        },
      ],
      'one-var': ['error', { initialized: 'never' }],
      'prefer-const': [
        'error',
        { destructuring: 'all', ignoreReadBeforeAssign: false },
      ],
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'symbol-description': ['error'],
      'unicode-bom': ['error', 'never'],
      'use-isnan': [
        'error',
        {
          enforceForSwitchCase: true,
          enforceForIndexOf: true,
        },
      ],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      'yoda': ['error', 'never'],
    },
  },
  {
    files: ['*', 'eslint/**/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      'no-alert': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'max-nested-callbacks': [
        'error',
        { max: 4 },
      ],
    },
  },
]);

function buildNoRestrictedRule(keys) {
  return Object.entries(restrictedGlobals)
    .filter(([key]) => keys.includes(key))
    .map(([key, restrictedGlobal]) => {
      return {
        name: key,
        message: restrictedGlobal.message,
      };
    });
}
