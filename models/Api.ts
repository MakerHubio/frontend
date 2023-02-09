export interface IdResponse {
  id: string;
}

export interface ApiResponse<T> {
  error: string,
  errorCode: number,
  data: T
}
