import type { FetchError } from 'ofetch/node';
import { useNuxtApp } from '#app';
import type { ApiFetchUtil, FetchedResponse } from '~/types/fetch';

async function apiFetch<ResponseT = unknown, ErrorT = unknown>({
  endpoint,
  noAuth,
  options = {}
}: ApiFetchUtil<ResponseT>) {
  const api = useNuxtApp().$api;
  // Set up the default response
  const response: FetchedResponse<ResponseT, ErrorT> = {
    data: null,
    error: null
  };

  try {
    response.data = await api(endpoint, {
      ...options,
      noAuth: noAuth
    } as object);
  } catch (error: unknown) {
    response.error = error as FetchError<ErrorT>;
  }
  return response;
}

export default apiFetch;
