import { navigateTo } from "#app";
import { FetchError } from "ofetch/node";
import { utilOptions } from "./api-fetch-options";
import type { ApiFetchUtil } from "~/types/fetch";
import useAuthStore from "~/stores/auth-store";

interface FetchedResponse<ResponseT, ErrorT> {
  data: ResponseT | null;
  error: FetchError<ErrorT> | null;
}

async function apiFetch<ResponseT = unknown, ErrorT = unknown>({
  endpoint,
  auth = true,
  options = {},
}: ApiFetchUtil<ResponseT>) {
  const { logout } = useAuthStore();

  // Set up the default response
  const response: FetchedResponse<ResponseT, ErrorT> = {
    data: null,
    error: null,
  };
  const cOptions = utilOptions(auth, options);

  try {
    response.data = await $fetch<ResponseT>(endpoint, {
      ...(cOptions as object),
      // Response hook for errors
      async onResponseError({ response }) {
        // If the response is Unauthorized the user isn't logged in
        // So it's forcerfully logged out and redirected to the login route.
        if (response.status === 401) {
          await logout(true);
          await navigateTo("/");
        }
      },
    });
  } catch (error: any) {
    response.error = error as FetchError<ErrorT>;
  }
  return response;
}

export default apiFetch;
