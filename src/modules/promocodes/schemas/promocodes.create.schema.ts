import { z } from 'zod'

export const promocodesCreateSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, 'Code can only contain letters, digits, underscores and hyphens'),
  discount: z.number().int().min(1).max(100),
  activationLimit: z.number().int().min(1),
  expiresAt: z.string().datetime().nullable().optional(),
})
