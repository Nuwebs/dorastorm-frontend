import { navigateTo } from "#app";
import { FetchError } from "ofetch/node";
import { utilOptions } from "./api-fetch-options";
import type { ApiFetchUtil } from "~/types/fetch";
import { logout } from "~/services/auth-service";

interface FetchedResponse<ResponseT, ErrorT> {
  data: ResponseT | null;
  error: FetchError<ErrorT> | null;
}

async function apiFetch<ResponseT = unknown, ErrorT = unknown>({
  endpoint,
  auth = true,
  options = {},
}: ApiFetchUtil<ResponseT>) {
  const response: FetchedResponse<ResponseT, ErrorT> = {
    data: null,
    error: null,
  };
  const cOptions = utilOptions(auth, options);
  try {
    response.data = await $fetch<ResponseT>(endpoint, {
      ...(cOptions as object),
      async onResponseError({ response }) {
        if (response.status === 401) {
          await logout(true);
          await navigateTo("/login");
        }
      },
    });
  } catch (error: any) {
    response.error = error as FetchError<ErrorT>;
  }
  return response;
}

export default apiFetch;
