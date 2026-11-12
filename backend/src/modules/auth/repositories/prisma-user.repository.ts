import type { prisma } from '../../../infrastructure/database/prisma.js';
import type { NewUser, UserRecord, UserRepository } from '../../../shared/ports/user.repository.js';
import { EmailTakenError } from '../domain/auth.errors.js';

// Código de Prisma para "violación de restricción única".
const UNIQUE_VIOLATION = 'P2002';

const PUBLIC_FIELDS = { id: true, email: true, role: true } as const;

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === UNIQUE_VIOLATION;
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: typeof prisma) {}

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.db.user.findUnique({ where: { email }, select: PUBLIC_FIELDS });
  }

  async create(data: NewUser): Promise<UserRecord> {
    try {
      return await this.db.user.create({ data, select: PUBLIC_FIELDS });
    } catch (error) {
      // Dos registros con el mismo email al mismo tiempo: el segundo choca con el índice único.
      if (isUniqueViolation(error)) throw new EmailTakenError();
      throw error;
    }
  }
}