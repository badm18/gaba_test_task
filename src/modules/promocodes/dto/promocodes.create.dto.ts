export class PromocodesCreateDto {
  code: string
  discount: number
  activationLimit: number
  expiresAt?: string | null
}
