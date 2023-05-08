import { useFetch } from "#imports";
import { UseFetchOptions, useRuntimeConfig } from "nuxt/app";
import useAuthStore from "~/stores/authStore";
import { ApiFetch } from "~/types";

const generateOptions = <ResponseT>(
  auth: boolean,
  options: Partial<UseFetchOptions<ResponseT>>
): UseFetchOptions<ResponseT> => {
  const config = useRuntimeConfig();
  const baseOptions: UseFetchOptions<ResponseT> = {
    baseURL: config.public.backendURL,
  };
  if (auth) {
    baseOptions.headers = {
      Authorization: `Bearer ${useAuthStore().token}`,
    };
  }
  return Object.assign({}, baseOptions, options);
};

const useAPIFetch = async <ResponseT = void>({
  endpoint,
  auth = true,
  options = {},
}: ApiFetch<ResponseT>) => {
  options = generateOptions<ResponseT>(auth, options);
  return useFetch<ResponseT>(endpoint, options as object);
};

export default useAPIFetch;
