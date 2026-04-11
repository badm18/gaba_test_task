import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema, z } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (err) {
      throw new BadRequestException({
        message: 'Validation failed',
        data: err instanceof z.ZodError ? err.flatten() : undefined,
      })
    }
  }
}
