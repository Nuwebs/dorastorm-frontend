import type { FetchError } from 'ofetch/node';
import type { UseFetchOptions } from '#app';

interface BaseApiFetch {
  endpoint: string;
  noAuth?: boolean;
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

export interface FetchedResponse<ResponseT, ErrorT> {
  data: ResponseT | null;
  error: FetchError<ErrorT> | null;
}
