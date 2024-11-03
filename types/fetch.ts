import type { UseFetchOptions } from "#app";

export interface ErrorBag<T = unknown> {
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
  "key" | "watch" | "$fetch"
>;

export interface ApiFetchUtil<ResponseT> extends BaseApiFetch {
  options?: UtilFetchOptions<ResponseT>;
}

export interface ApiFetchComposable<ResponseT> extends BaseApiFetch {
  options?: UseFetchOptions<ResponseT>;
}
