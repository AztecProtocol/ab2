/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: './node_modules/config/eslint/library.js',
  ignorePatterns: ['apps/**', 'packages/**'],
};
