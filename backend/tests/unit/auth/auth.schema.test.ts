import { describe, expect, it } from 'vitest';
import { registerBodySchema } from '../../../src/modules/auth/schemas/auth.schema.js';

describe('registerBodySchema', () => {
  it('pasa el email a minúsculas', () => {
    const body = registerBodySchema.parse({
      email: 'Duena@Ejemplo.COM',
      password: 'una-clave-segura',
    });

    expect(body.email).toBe('duena@ejemplo.com');
  });

  it('rechaza un email inválido', () => {
    const result = registerBodySchema.safeParse({ email: 'no-es-un-email', password: 'una-clave-segura' });

    expect(result.success).toBe(false);
  });

  it('rechaza una contraseña de menos de 8 caracteres', () => {
    const result = registerBodySchema.safeParse({ email: 'duena@ejemplo.com', password: '1234567' });

    expect(result.success).toBe(false);
  });

  it('rechaza una contraseña de más de 72 caracteres', () => {
    const result = registerBodySchema.safeParse({ email: 'duena@ejemplo.com', password: 'a'.repeat(73) });

    expect(result.success).toBe(false);
  });
});