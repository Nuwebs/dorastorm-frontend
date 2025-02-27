import type { FetchError } from 'ofetch/node';
import { useFetch, useNuxtApp } from '#app';
import type { ApiFetchComposable } from '~/types/fetch';

export default function useApiFetch<ResponseT = void, ErrorT = unknown>({
  endpoint,
  noAuth,
  options
}: ApiFetchComposable<ResponseT>) {
  return useFetch<ResponseT, FetchError<ErrorT>>(endpoint, {
    ...options,
    noAuth,
    $fetch: useNuxtApp().$api
  } as object);
}
