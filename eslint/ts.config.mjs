import { defineConfig } from 'eslint/config';
import * as typescriptEslint from 'typescript-eslint';

export default defineConfig(typescriptEslint.config(
  {
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': ['error'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/await-thenable': ['error'],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          'minimumDescriptionLength': 3,
        },
      ],
      '@typescript-eslint/ban-tslint-comment': ['error'],
      '@typescript-eslint/class-literal-property-style': ['error', 'fields'],
      '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/dot-notation': [
        'error',
        {
          allowIndexSignaturePropertyAccess: false,
          allowKeywords: true,
          allowPattern: '',
          allowPrivateClassPropertyAccess: false,
          allowProtectedClassPropertyAccess: false,
        },
      ],
      '@typescript-eslint/max-params': ['error', { max: 4 }],
      '@typescript-eslint/method-signature-style': ['error'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],
      '@typescript-eslint/no-array-constructor': ['error'],
      '@typescript-eslint/no-array-delete': ['error'],
      '@typescript-eslint/no-base-to-string': ['error'],
      '@typescript-eslint/no-confusing-non-null-assertion': ['error'],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: false, ignoreVoidOperator: false },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-dupe-class-members': ['error'],
      '@typescript-eslint/no-duplicate-enum-values': ['error'],
      '@typescript-eslint/no-duplicate-type-constituents': [
        'error',
        { ignoreIntersections: false, ignoreUnions: false },
      ],
      '@typescript-eslint/no-dynamic-delete': ['error'],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'arrowFunctions',
            'decoratedFunctions',
            'overrideMethods',
            'private-constructors',
            'protected-constructors',
          ],
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends', allowObjectTypes: 'never' },
      ],
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: false, ignoreRestArgs: false },
      ],
      '@typescript-eslint/no-extra-non-null-assertion': ['error'],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-for-in-array': ['error'],
      '@typescript-eslint/no-implied-eval': ['error'],
      '@typescript-eslint/no-invalid-void-type': ['error'],
      '@typescript-eslint/no-loop-func': ['error'],
      '@typescript-eslint/no-meaningless-void-operator': ['error', { checkNever: true }],
      '@typescript-eslint/no-misused-new': ['error'],
      '@typescript-eslint/no-misused-promises': ['error'],
      '@typescript-eslint/no-misused-spread': ['error', { allow: [] }],
      '@typescript-eslint/no-mixed-enums': ['error'],
      '@typescript-eslint/no-namespace': ['error'],
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': ['error'],
      '@typescript-eslint/no-non-null-asserted-optional-chain': ['error'],
      '@typescript-eslint/no-non-null-assertion': ['error'],
      '@typescript-eslint/no-redundant-type-constituents': ['error'],
      '@typescript-eslint/no-require-imports': ['error', { allow: [], allowAsImport: false }],
      '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['error'],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': ['error'],
      '@typescript-eslint/no-unnecessary-qualifier': ['error'],
      '@typescript-eslint/no-unnecessary-template-expression': ['error'],
      '@typescript-eslint/no-unnecessary-type-assertion': ['error'],
      '@typescript-eslint/no-unnecessary-type-constraint': ['error'],
      '@typescript-eslint/no-unnecessary-type-conversion': ['error'],
      '@typescript-eslint/no-unsafe-argument': ['error'],
      '@typescript-eslint/no-unsafe-assignment': ['error'],
      '@typescript-eslint/no-unsafe-call': ['error'],
      '@typescript-eslint/no-unsafe-declaration-merging': ['error'],
      '@typescript-eslint/no-unsafe-enum-comparison': ['error'],
      '@typescript-eslint/no-unsafe-function-type': ['error'],
      '@typescript-eslint/no-unsafe-member-access': ['error'],
      '@typescript-eslint/no-unsafe-return': ['error'],
      '@typescript-eslint/no-unsafe-type-assertion': ['error'],
      '@typescript-eslint/no-unsafe-unary-minus': ['error'],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
        },
      ],
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/no-useless-empty-export': ['error'],
      '@typescript-eslint/no-wrapper-object-types': ['error'],
      '@typescript-eslint/non-nullable-type-assertion-style': ['error'],
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allowThrowingAny: false,
          allowThrowingUnknown: true,
        },
      ],
      '@typescript-eslint/prefer-as-const': ['error'],
      '@typescript-eslint/prefer-find': ['error'],
      '@typescript-eslint/prefer-for-of': ['error'],
      '@typescript-eslint/prefer-function-type': ['error'],
      '@typescript-eslint/prefer-includes': ['error'],
      '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
      '@typescript-eslint/prefer-namespace-keyword': ['error'],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignoreConditionalTests: false, ignoreMixedLogicalExpressions: false },
      ],
      '@typescript-eslint/prefer-optional-chain': ['error'],
      '@typescript-eslint/prefer-promise-reject-errors': [
        'error',
        {
          allowThrowingUnknown: true,
        },
      ],
      '@typescript-eslint/prefer-readonly': ['error'],
      '@typescript-eslint/prefer-reduce-type-parameter': ['error'],
      '@typescript-eslint/prefer-regexp-exec': ['error'],
      '@typescript-eslint/prefer-return-this-type': ['error'],
      '@typescript-eslint/prefer-string-starts-ends-with': [
        'error',
        { allowSingleElementEquality: 'never' },
      ],
      '@typescript-eslint/promise-function-async': ['error'],
      '@typescript-eslint/related-getter-setter-pairs': ['error'],
      '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: false }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: false,
          considerDefaultExhaustiveForUnions: true,
        },
      ],
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { lib: 'never', path: 'never', types: 'never' },
      ],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: false }],
      '@typescript-eslint/unified-signatures': [
        'error',
        { ignoreDifferentlyNamedParameters: false },
      ],
      '@typescript-eslint/use-unknown-in-catch-callback-variable': ['error'],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      // Declaration files may contain unused variables since they are not having implementations
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      // Non-null assertions are often used in tests to shorthand assertions
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Mocking functions can lead to unbound method errors
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    extends: [typescriptEslint.configs.disableTypeChecked],
  },
));
