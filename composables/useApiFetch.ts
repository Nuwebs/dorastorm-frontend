import type { FetchError } from 'ofetch/node';
import { useFetch, useRuntimeConfig, type UseFetchOptions } from '#app';
import { useI18n } from '#imports';
import useAuthStore from '~/stores/auth-store';
import type { ApiFetchComposable } from '~/types/fetch';

export default function useApiFetch<ResponseT = void, ErrorT = unknown>({
  endpoint,
  auth = true,
  options
}: ApiFetchComposable<ResponseT>) {
  const { token } = useAuthStore();
  const { public: p } = useRuntimeConfig();
  const { locale } = useI18n();

  const baseOptions: UseFetchOptions<ResponseT> = {
    baseURL: p.backendURL,
    headers: {
      'Accept-Language': locale
    }
  };

  if (auth) {
    baseOptions.headers = {
      ...baseOptions.headers,
      Authorization: `Bearer ${token}`
    };
  }

  const processedOptions: UseFetchOptions<ResponseT> = {
    ...baseOptions,
    ...options
  };

  return useFetch<ResponseT, FetchError<ErrorT>>(endpoint, {
    ...(processedOptions as object)
  });
}
