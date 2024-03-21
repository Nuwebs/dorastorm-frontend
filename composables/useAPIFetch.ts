import { navigateTo } from 'nuxt/app';
import { FetchError } from 'ofetch/node';
import { useFetch } from '#imports';
import type { ApiFetchComposable } from '~/types';
import { logout } from '~/services/auth';
import { composableOptions } from '~/utils/api-fetch-options';

const useAPIFetch = async <ResponseT = void, ErrorT = any>({
  endpoint,
  auth = true,
  options = {}
}: ApiFetchComposable<ResponseT>) => {
  const cOptions = composableOptions<ResponseT>(auth, options);
  return await useFetch<ResponseT, FetchError<ErrorT>>(endpoint, {
    ...(cOptions as object),
    async onResponseError({ response }) {
      if (response.status === 401) {
        await logout(true);
        navigateTo('/login');
      }
    }
  });
};

export default useAPIFetch;
