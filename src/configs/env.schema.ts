import { z } from 'zod'

export const envSchema = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().positive(),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  APP_PORT: z.coerce.number().positive().optional(),
  POSTGRES_STATEMENT_TIMEOUT: z.coerce.number().positive().optional(),
  POSTGRES_POOL_MAX: z.coerce.number().positive().optional(),
  POSTGRES_POOL_MIN: z.coerce.number().positive().optional(),
})
