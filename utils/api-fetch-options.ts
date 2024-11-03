import { useRuntimeConfig, type UseFetchOptions, useNuxtApp } from "#app";
import useAuthStore from "~/stores/auth-store";
import type { UtilFetchOptions } from "~/types/fetch";

type Intersection<ResponseT> = UtilFetchOptions<ResponseT> &
  UseFetchOptions<ResponseT>;

function generateOptions<ResponseT>(
  auth: boolean,
  options: Partial<Intersection<ResponseT>>
): Intersection<ResponseT> {
  const config = useRuntimeConfig();

  const baseOptions: UtilFetchOptions<ResponseT> = {
    baseURL: config.public.backendURL,
  };
  if (auth) {
    baseOptions.headers = {
      Authorization: `Bearer ${useAuthStore().token}`,
    };
  }
  const locale = useNuxtApp().$i18n.locale;
  baseOptions.headers = {
    ...baseOptions.headers,
    "Accept-Language": locale,
  };
  return Object.assign({}, baseOptions, options);
}

export function composableOptions<ResponseT>(
  auth: boolean,
  options: Partial<UseFetchOptions<ResponseT>>
): UseFetchOptions<ResponseT> {
  const baseOptions = generateOptions(auth, options);
  baseOptions.watch = false;
  return baseOptions;
}

export function utilOptions<ResponseT>(
  auth: boolean,
  options: Partial<UtilFetchOptions<ResponseT>>
): UtilFetchOptions<ResponseT> {
  return generateOptions(auth, options);
}
