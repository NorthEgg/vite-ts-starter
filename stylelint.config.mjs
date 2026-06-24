export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-vue/scss'
  ],
  ignoreFiles: ['**/*.js', '**/*.ts'],
  defaultSeverity: 'error',
  rules: {
    'unit-disallowed-list': ['rem', 'pt'],
    'no-empty-source': null,
    'block-no-empty': null,
    'declaration-block-no-duplicate-custom-properties': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-class-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',
    'scss/at-mixin-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$|^([a-z][a-z0-9]*)(_[a-z0-9]+)*$',
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/dollar-variable-pattern': null,
    'declaration-property-value-no-unknown': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'deep']
      }
    ],
    'property-no-unknown': null,
    'scss/at-rule-no-unknown': null,
    'at-rule-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['box-shadow']
      }
    ]
  }
}
