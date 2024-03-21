import type { UseFetchOptions } from 'nuxt/app';

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

interface BaseApiFetch {
  endpoint: string;
  auth?: boolean;
}

export type UtilFetchOptions<ResponseT> = Omit<
  UseFetchOptions<ResponseT>,
  'key' | 'watch' | '$fetch'
>;

export interface ApiFetchUtil<ResponseT> extends BaseApiFetch {
  options?: UtilFetchOptions<ResponseT>;
}

export interface ApiFetchComposable<ResponseT> extends BaseApiFetch {
  options?: UseFetchOptions<ResponseT>;
}
