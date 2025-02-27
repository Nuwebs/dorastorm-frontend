import handleFetchCall from './handle-fetch-call';
import { useNuxtApp } from '#app';
import type { ApiFetchUtil } from '~/types/fetch';

async function apiFetch<ResponseT = unknown, ErrorT = unknown>({
  endpoint,
  noAuth,
  options = {}
}: ApiFetchUtil<ResponseT>) {
  const api = useNuxtApp().$api;

  return handleFetchCall<ResponseT, ErrorT>(
    api(endpoint, {
      ...options,
      noAuth: noAuth
    } as object)
  );
}

export default apiFetch;
