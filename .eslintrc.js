module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['html'],
  rules: {
    // Error Prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-duplicate-case': 'error',
    
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'dot-notation': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    
    // Style (handled by Prettier, but some semantic rules)
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    
    // Performance
    'no-loop-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    
    // Accessibility
    'no-invalid-regexp': 'error',
    
    // Modern JS
    'prefer-destructuring': ['error', {
      array: false,
      object: true
    }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error'
  },
  globals: {
    // Define global variables used in the project
    'IntersectionObserver': 'readonly',
    'AbortController': 'readonly'
  },
  overrides: [
    {
      files: ['*.html'],
      parser: '@html-eslint/parser',
      rules: {
        // HTML-specific rules can be added here
      }
    }
  ]
};
