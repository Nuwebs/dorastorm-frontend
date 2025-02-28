import handleFetchCall from './handle-fetch-call';
import { useNuxtApp } from '#app';
import type { ApiFetch, UtilFetchOptions } from '~/types/fetch';

async function apiFetch<ResponseT = unknown, ErrorT = unknown>({
  endpoint,
  noAuth,
  options = {}
}: ApiFetch<ResponseT, UtilFetchOptions<ResponseT>>) {
  const api = useNuxtApp().$api;

  return handleFetchCall<ResponseT, ErrorT>(
    api(endpoint, {
      ...options,
      noAuth: noAuth
    } as object)
  );
}

export default apiFetch;
