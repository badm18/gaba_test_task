export class ResponseDto<T = unknown> {
  message: string
  data?: T
}

export type PromiseResponseDto<T = unknown> = Promise<ResponseDto<T>>
