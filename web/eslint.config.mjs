import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Un módulo usa a otro solo por su index.ts (D-31). Hay una copia de esta regla en panel/.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Desde fuera de modules/: '@/modules/businesses/components/BusinessCard'.
              regex: '(^|/)modules/[^/]+/(api|hooks|components|pages|schemas|domain)(/|$)',
              message:
                'Importá el módulo por su index.ts (por ejemplo, @/modules/businesses), no sus carpetas internas (D-31).',
            },
            {
              // De un módulo a otro: '../../categories/api/categories.api'.
              regex: '^(\\.\\./){2,}[^./][^/]*/(api|hooks|components|pages|schemas|domain)(/|$)',
              message:
                'Un módulo usa a otro solo por su index.ts (por ejemplo, @/modules/categories), no sus carpetas internas (D-31).',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
