import { navigateTo } from '#app';
import { utilOptions } from './api-fetch-options';
import { logout } from '~/services/auth';
import type { ApiFetchUtil } from '~/types';

interface FetchedResponse<ResponseT, ErrorT> {
  data: ResponseT | null;
  error: ErrorT | null;
}

async function apiFetch<ResponseT = void, ErrorT = any>({
  endpoint,
  auth = true,
  options = {}
}: ApiFetchUtil<ResponseT>) {
  const response: FetchedResponse<ResponseT, ErrorT> = {
    data: null,
    error: null
  };
  const cOptions = utilOptions(auth, options);
  try {
    response.data = await $fetch<ResponseT>(endpoint, {
      ...(cOptions as object),
      async onResponseError({ response }) {
        if (response.status === 401) {
          await logout(true);
          await navigateTo('/login');
        }
      }
    });
  } catch (error: any) {
    response.error = error as ErrorT;
  }
  return response;
}

export default apiFetch;
