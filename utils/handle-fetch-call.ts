import type { FetchError } from 'ofetch/node';
import type { FetchedResponse } from '~/types/fetch';

export default async function handleFetchCall<
  ResponseT = unknown,
  ErrorT = unknown
>(promise: Promise<ResponseT>): Promise<FetchedResponse<ResponseT, ErrorT>> {
  const response: FetchedResponse<ResponseT, ErrorT> = {
    data: null,
    error: null
  };

  try {
    response.data = await promise;
    return response;
  } catch (error: unknown) {
    response.error = error as FetchError<ErrorT>;
  }
  return response;
}
