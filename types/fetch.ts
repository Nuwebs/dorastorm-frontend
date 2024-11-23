import type { UseFetchOptions } from "#app";

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
