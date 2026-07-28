module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue', 'simple-import-sort'],
  rules: {
    // ==========================================
    // Import ordering
    // ==========================================
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          [
            '^vue$',
            '^pinia',
            '^vue-router',
            '^vuetify',
            '^@mdi',
            '^axios',
            '^dayjs',
            '^apexcharts',
            '^vue3-',
            '^html2canvas',
            '^jspdf',
            '^xlsx$',
          ],
          ['^@/stores'],
          ['^@/constants'],
          ['^@/models', '^.+\\u0000$'],
          ['^@/composables'],
          ['^@/utils'],
          ['^@/services'],
          ['^@/components'],
          ['^@?\\w'],
          ['^'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // ==========================================
    // Vue template attributes order
    // ==========================================
    'vue/attributes-order': [
      'error',
      {
        order: [
          'CONDITIONALS',
          'LIST_RENDERING',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
        ],
        alphabetical: false,
      },
    ],

    // ==========================================
    // Vue attribute hyphenation (allow camelCase)
    // ==========================================
    'vue/attribute-hyphenation': [
      'error',
      'never',
    ],

    // ==========================================
    // Vue block order
    // ==========================================
    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],

    // ==========================================
    // Vue general rules
    // ==========================================
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: { max: 1 },
        multiline: { max: 1 },
      },
    ],
    'vue/first-attribute-linebreak': [
      'warn',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/html-indent': [
      'warn',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: [],
      },
    ],

    // ==========================================
    // TypeScript rules
    // ==========================================
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    'no-console': 'warn',

    // ==========================================
    // Naming conventions
    // ==========================================
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
        prefix: ['C'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: ['function', 'method'],
        format: ['camelCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        prefix: ['p'],
      },
    ],
  },
};
