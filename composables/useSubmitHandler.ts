import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';
import useGeneralErrorToast from './useGeneralErrorToast';
import type { ApiFetchUtil } from '~/types';
import apiFetch from '~/utils/api-fetch';

const defaultErrorHandler = (): void => {
  const toast = useToast();
  toast.add(useGeneralErrorToast());
};

const useSubmitHandler = async <ErrorT = any>(
  options: ApiFetchUtil<void>,
  successHandler: () => void,
  errorHandler: (error: FetchError<ErrorT>) => void = () =>
    defaultErrorHandler()
): Promise<boolean> => {
  const { error } = await apiFetch(options);

  if (error) {
    errorHandler(error);
    return false;
  }
  successHandler();
  return true;
};

export default useSubmitHandler;
