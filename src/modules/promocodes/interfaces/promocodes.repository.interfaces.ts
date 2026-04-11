export interface CreatePromocodeParams {
  code: string
  discount: number
  activationLimit: number
  expiresAt: Date | null
}

export interface UpdatePromocodeParams {
  code?: string
  discount?: number
  activationLimit?: number
  expiresAt?: Date | null
}

export interface GetPromocodesParams {
  limit: number
  offset: number
  code?: string
}

export interface CreateActivationParams {
  promocodeId: string
  email: string
}
