import bcrypt from 'bcrypt';
import type { UserRepository } from '../../../shared/ports/user.repository.js';
import { EmailTakenError } from '../domain/auth.errors.js';
import type { RegisterBody, RegisterResponse } from '../schemas/auth.schema.js';

// Costo del hash: cada +1 duplica el tiempo de cálculo.
const BCRYPT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async register(input: RegisterBody): Promise<RegisterResponse> {
    if (await this.users.findByEmail(input.email)) {
      throw new EmailTakenError();
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.users.create({ email: input.email, passwordHash, role: 'owner' });

    // Solo sale lo que promete el contrato: nunca el hash.
    return { id: user.id, email: user.email };
  }
}