import js from '@eslint/js';
import globals from 'globals';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
  globalIgnores(['flow-typed/']),
  {
    files: ['**/*.js'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
    },
  },
]);
