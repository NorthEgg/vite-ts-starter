export default {
  '*.{js,cjs,mjs,ts,tsx}': ['prettier --write', 'eslint --quiet --fix'],
  '*.vue': [
    'prettier --write',
    'eslint --quiet --fix',
    'stylelint --fix --allow-empty-input'
  ],
  '*.{css,scss}': ['prettier --write', 'stylelint --fix --allow-empty-input'],
  '*.{json,md,html,yml,yaml}': 'prettier --write'
}
