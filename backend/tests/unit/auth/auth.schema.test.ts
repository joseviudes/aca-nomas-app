import bcrypt from 'bcrypt';
import { describe, expect, it } from 'vitest';
import { EmailTakenError } from '../../../src/modules/auth/domain/auth.errors.js';
import { AuthService } from '../../../src/modules/auth/services/auth.service.js';
import type { NewUser, UserRecord, UserRepository } from '../../../src/shared/ports/user.repository.js';

// Repositorio falso: guarda en memoria, así la prueba no necesita base de datos.
class InMemoryUserRepository implements UserRepository {
  readonly users: (UserRecord & { passwordHash: string })[] = [];

  findByEmail(email: string): Promise<UserRecord | null> {
    return Promise.resolve(this.users.find((user) => user.email === email) ?? null);
  }

  create(data: NewUser): Promise<UserRecord> {
    const user = { id: `user-${this.users.length + 1}`, ...data };
    this.users.push(user);
    return Promise.resolve(user);
  }
}

const body = { email: 'duena@ejemplo.com', password: 'una-clave-segura' };

describe('AuthService.register', () => {
  it('crea la cuenta y devuelve solo id y email', async () => {
    const service = new AuthService(new InMemoryUserRepository());

    const result = await service.register(body);

    expect(result).toEqual({ id: expect.any(String), email: body.email });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('guarda la contraseña con hash, no en texto plano', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    await service.register(body);

    const saved = repository.users[0];
    expect(saved?.passwordHash).not.toBe(body.password);
    expect(await bcrypt.compare(body.password, saved?.passwordHash ?? '')).toBe(true);
  });

  it('crea la cuenta con el rol owner', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    await service.register(body);

    expect(repository.users[0]?.role).toBe('owner');
  });

  it('lanza EMAIL_TAKEN si el email ya está registrado', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);
    await service.register(body);

    const second = service.register(body);

    await expect(second).rejects.toBeInstanceOf(EmailTakenError);
    await expect(second).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_TAKEN' });
    expect(repository.users).toHaveLength(1);
  });
});