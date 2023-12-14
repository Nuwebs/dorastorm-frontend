import { UseFetchOptions } from 'nuxt/app';

export interface JWTResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
export interface ErrorBag<T = any> {
  statusCode: number;
  statusMessage: string;
  data?: T;
}
export interface ApiFetch<ResponseT> {
  endpoint: string;
  auth?: boolean;
  options?: UseFetchOptions<ResponseT>;
}
