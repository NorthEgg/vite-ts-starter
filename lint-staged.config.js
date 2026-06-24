export default {
  '*.{js,cjs,mjs,ts,tsx}': [
    'oxfmt --write --no-error-on-unmatched-pattern',
    'oxlint --fix --no-error-on-unmatched-pattern',
  ],
  '*.vue': [
    'oxfmt --write --no-error-on-unmatched-pattern',
    'oxlint --vue-plugin --fix --no-error-on-unmatched-pattern',
    'stylelint --fix --allow-empty-input',
  ],
  '*.{css,scss}': [
    'oxfmt --write --no-error-on-unmatched-pattern',
    'stylelint --fix --allow-empty-input',
  ],
  '*.{json,md,html,yml,yaml}': 'oxfmt --write --no-error-on-unmatched-pattern',
};
