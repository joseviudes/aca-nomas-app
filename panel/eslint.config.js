import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,

  {
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Un módulo usa a otro solo por su index.ts (D-31). Hay una copia de esta regla en web/.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Desde fuera de modules/: '../modules/auth/hooks/use-login'.
              regex: '(^|/)modules/[^/]+/(api|hooks|components|pages|schemas|domain)(/|$)',
              message:
                'Importá el módulo por su index.ts (por ejemplo, ../modules/auth), no sus carpetas internas (D-31).',
            },
            {
              // De un módulo a otro: '../../businesses/components/BusinessCard'.
              regex: '^(\\.\\./){2,}[^./][^/]*/(api|hooks|components|pages|schemas|domain)(/|$)',
              message:
                'Un módulo usa a otro solo por su index.ts (por ejemplo, ../../businesses), no sus carpetas internas (D-31).',
            },
          ],
        },
      ],
    },
  },

  prettier,
);
