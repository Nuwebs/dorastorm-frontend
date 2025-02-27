import type { FetchOptions, FetchResponse } from 'ofetch'; // Import FetchOptions from ofetch
import {
  defineNuxtPlugin,
  navigateTo,
  useNuxtApp,
  useRuntimeConfig
} from '#app';
import useAuthStore from '~/stores/auth-store';

// Extend FetchOptions to include noAuth
interface CustomFetchOptions extends FetchOptions {
  noAuth?: boolean;
}

export default defineNuxtPlugin({
  setup() {
    const auth = useAuthStore();
    const config = useRuntimeConfig();

    const api = $fetch.create({
      baseURL: config.public.backendURL,
      onRequest({ options }: { options: CustomFetchOptions }) {
        const headers: Record<string, string> = {
          'Accept-Language': useNuxtApp().$i18n.locale.value
        };

        if (!options.noAuth) {
          headers.Authorization = `Bearer ${auth.token}`;
        }

        // Merge with any headers provided in the request options
        options.headers = { ...options.headers, ...headers };
      },
      async onResponseError({
        response,
        options
      }: {
        response: FetchResponse<unknown>;
        options: CustomFetchOptions;
      }) {
        if (response.status === 401 && !options.noAuth) {
          await auth.logout(true);
          await navigateTo('/');
        }
      }
    });

    return {
      provide: {
        api
      }
    };
  }
});
