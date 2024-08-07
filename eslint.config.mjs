import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: [
      'discretize-gear-optimizer/**',
      'discretize-guides/**',
      'discretize-ui/**',
      'gw2-api-extended/**',
      'dist/*',
    ],
  },

  eslint.configs.recommended,
  // ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  // ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        'ImageMetadata': 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
