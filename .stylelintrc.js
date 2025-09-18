module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
  ],
  rules: {
    // Accessibility
    'color-contrast': true,
    'font-family-no-missing-generic-family-keyword': true,
    
    // Performance
    'no-duplicate-selectors': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'shorthand-property-no-redundant-values': true,
    
    // Best Practices
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'tailwind',
        'apply',
        'variants',
        'responsive',
        'screen'
      ]
    }],
    'property-no-unknown': true,
    'unit-no-unknown': true,
    'selector-type-no-unknown': true,
    
    // Consistency
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'string-quotes': 'single',
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    
    // Modern CSS
    'declaration-property-value-no-unknown': true,
    'property-no-vendor-prefix': [true, {
      ignoreProperties: ['appearance', 'user-select']
    }],
    'value-no-vendor-prefix': [true, {
      ignoreValues: ['box', 'inline-box']
    }],
    
    // Performance optimizations
    'selector-max-compound-selectors': 4,
    'selector-max-specificity': '0,4,0',
    'max-nesting-depth': 3,
    
    // Disable some rules that conflict with CSS custom properties
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    
    // Allow CSS Grid and Flexbox properties
    'property-no-unknown': [true, {
      ignoreProperties: [
        'grid-template-areas',
        'grid-template-columns',
        'grid-template-rows',
        'grid-area'
      ]
    }]
  },
  ignoreFiles: [
    'deprecated/**/*.css',
    'node_modules/**/*.css',
    '*.min.css'
  ]
};
