import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

// Prueba de ejemplo: confirma que Vitest resuelve los imports ESM de src/.
describe('createApp', () => {
  it('returns an Express app ready to listen', () => {
    const app = createApp();

    expect(typeof app.listen).toBe('function');
  });
});
