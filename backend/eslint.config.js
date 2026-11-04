import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const EXPRESS = 'express';
const PRISMA = ['@prisma/*', '**/generated/prisma/**'];

const layerRule = (patterns, message) => ({
  'no-restricted-imports': ['error', { patterns: [{ group: patterns, message }] }],
});

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'src/generated/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Express 5 captura los errores async; una promesa sin await los pierde igual.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Reglas de capas (D-06): cada capa solo depende de las que están por debajo.
  {
    files: ['src/modules/*/domain/**/*.ts'],
    rules: layerRule(
      [
        EXPRESS,
        ...PRISMA,
        '**/routes/**',
        '**/controllers/**',
        '**/services/**',
        '**/repositories/**',
        '**/infrastructure/**',
      ],
      'El dominio es puro: no depende de Express, Prisma ni de otras capas.',
    ),
  },
  {
    files: ['src/modules/*/services/**/*.ts'],
    rules: layerRule(
      [
        EXPRESS,
        ...PRISMA,
        '**/routes/**',
        '**/controllers/**',
        '**/repositories/**',
        '**/infrastructure/**',
      ],
      'Los servicios no importan Express ni Prisma. Usan los contratos de shared/ports, que se inyectan desde container.ts.',
    ),
  },
  {
    files: ['src/modules/*/controllers/**/*.ts'],
    rules: layerRule(
      [...PRISMA, '**/repositories/**', '**/infrastructure/**'],
      'Los controladores llaman al servicio; no acceden a datos.',
    ),
  },
  {
    files: ['src/modules/*/repositories/**/*.ts'],
    rules: layerRule(
      [EXPRESS, '**/routes/**', '**/controllers/**', '**/services/**'],
      'Los repositorios solo acceden a datos: no conocen HTTP ni reglas de negocio.',
    ),
  },
  {
    files: ['src/shared/ports/**/*.ts'],
    rules: layerRule(
      [EXPRESS, ...PRISMA, '**/infrastructure/**'],
      'Los puertos son contratos: no dependen de ninguna tecnología.',
    ),
  },

  prettier,
);
