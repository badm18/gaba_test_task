import { z } from 'zod'

export const promocodesActivateSchema = z.object({
  email: z.string().email(),
})
