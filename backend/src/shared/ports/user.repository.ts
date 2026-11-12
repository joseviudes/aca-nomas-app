export type UserRole = 'owner' | 'admin';

export interface UserRecord {
  id: string;
  email: string;
  role: UserRole;
}

export interface NewUser {
  email: string;
  passwordHash: string;
  role: UserRole;
}

// Contrato de acceso a las cuentas. Lo implementa PrismaUserRepository (D-06).
export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(data: NewUser): Promise<UserRecord>;
}