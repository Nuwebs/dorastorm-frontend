import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';
import useGeneralErrorToast from './use-general-error-toast';
import type { ApiFetchUtil } from '~/types';
import apiFetch from '~/utils/api-fetch';

const defaultErrorHandler = (): void => {
  // TODO: To become a real util, the toast should be moved away
  const toast = useToast();
  toast.add(useGeneralErrorToast());
};

// TODO: Convert it to an util
const useSubmitHandler = async <ErrorT = any, ResponseT = unknown>(
  options: ApiFetchUtil<ResponseT>,
  successHandler: (data?: ResponseT | null) => void,
  errorHandler: (error: FetchError<ErrorT>) => void = () =>
    defaultErrorHandler()
): Promise<boolean> => {
  const { data, error } = await apiFetch<ResponseT, ErrorT>(options);

  if (error) {
    errorHandler(error);
    return false;
  }
  successHandler(data);
  return true;
};

export default useSubmitHandler;
