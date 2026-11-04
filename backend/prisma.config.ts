import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// La CLI de Prisma no lee .env sola. loadEnvFile es nativo de Node: no hace falta dotenv.
if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // generate no se conecta a la base: alcanza con un valor vacío si todavía no hay .env.
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
