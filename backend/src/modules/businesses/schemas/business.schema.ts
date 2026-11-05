import { z } from 'zod';

// Medios de pago permitidos (RF-18). La base guarda la lista en JSONB y no valida los valores (D-22).
export const PAYMENT_METHODS = ['cash', 'transfer', 'card', 'mercado_pago'] as const;

export const paymentMethodsSchema = z
  .array(z.enum(PAYMENT_METHODS))
  .refine((methods) => new Set(methods).size === methods.length, {
    message: 'Los medios de pago no se pueden repetir',
  });

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
