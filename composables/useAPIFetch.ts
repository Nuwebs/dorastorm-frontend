import { useFetch, useNuxtApp } from "#imports";
import { UseFetchOptions, navigateTo, useRuntimeConfig } from "nuxt/app";
import useAuthStore from "~/stores/authStore";
import { ApiFetch } from "~/types";
import { logout } from "~/services/auth";

const generateOptions = <ResponseT>(
  auth: boolean,
  options: Partial<UseFetchOptions<ResponseT>>
): UseFetchOptions<ResponseT> => {
  const config = useRuntimeConfig();
  const baseOptions: UseFetchOptions<ResponseT> = {
    baseURL: config.public.backendURL,
    watch: false
  };
  if (auth) {
    baseOptions.headers = {
      Authorization: `Bearer ${useAuthStore().token}`
    };
  }
  const locale = useNuxtApp().$i18n.locale;
  baseOptions.headers = {
    ... baseOptions.headers,
    "Accept-Language": locale
  }
  return Object.assign({}, baseOptions, options);
};

const useAPIFetch = async <ResponseT = void>({
  endpoint,
  auth = true,
  options = {},
}: ApiFetch<ResponseT>) => {
  const cOptions = generateOptions<ResponseT>(auth, options);
  return useFetch<ResponseT>(endpoint, {
    ... cOptions as object,
    async onResponseError({response}) {
      if (response.status === 401) {
        await logout(true);
        navigateTo("/login");
      }
    },
  });
};

export default useAPIFetch;
