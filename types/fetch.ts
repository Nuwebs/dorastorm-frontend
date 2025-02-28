import type { FetchError, FetchOptions } from 'ofetch/node';
import type { UseFetchOptions } from '#app';

interface BaseApiFetch {
  endpoint: string;
  noAuth?: boolean;
}

export type UtilFetchOptions<ResponseT> = Omit<
  UseFetchOptions<ResponseT>,
  'key' | 'watch' | '$fetch'
>;

// Combine ApiFetchUtil and ApiFetchComposable under one generic type
export interface ApiFetch<ResponseT, OptionsT = UseFetchOptions<ResponseT>>
  extends BaseApiFetch {
  options?: OptionsT;
}

// Use default generic for ErrorT to avoid repetition
export interface FetchedResponse<ResponseT, ErrorT = unknown> {
  data: ResponseT | null;
  error: FetchError<ErrorT> | null;
}

// Instead of CustomFetchOptions, use intersection type
export type CustomFetchOptions = FetchOptions & { noAuth?: boolean };
