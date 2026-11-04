import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../config/env.js';
import { PrismaClient } from '../../generated/prisma/client.js';

export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Cliente único (Singleton, D-19): el módulo se evalúa una sola vez, así que toda la app comparte
// el mismo pool de conexiones. Solo los repositorios y container.ts lo importan.
export const prisma = createPrismaClient(env.DATABASE_URL);
