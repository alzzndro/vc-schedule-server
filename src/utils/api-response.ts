export class ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  meta?: Record<string, unknown>

  constructor({
    success = true,
    message,
    data,
    meta,
  }: {
    success?: boolean
    message: string
    data?: T
    meta?: Record<string, unknown>
  }) {
    this.success = success
    this.message = message
    this.data = data
    this.meta = meta
  }
}