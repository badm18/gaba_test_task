export class PromocodeResDto {
  id: string
  code: string
  discount: number
  activationLimit: number
  activationsCount: number
  expiresAt: string | null
  createdAt: string
}

export class ActivationResDto {
  id: string
  promocodeId: string
  email: string
  createdAt: string
}
