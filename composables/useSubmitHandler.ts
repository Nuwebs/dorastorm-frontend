import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';
import useAPIFetch from './useAPIFetch';
import useGeneralErrorToast from './useGeneralErrorToast';
import { ApiFetch } from '~/types';

const defaultErrorHandler = (): void => {
  const toast = useToast();
  toast.add(useGeneralErrorToast());
};

const useSubmitHandler = async <ErrorT = any>(
  options: ApiFetch<void>,
  successHandler: () => void,
  errorHandler: (error: FetchError<ErrorT>) => void = () =>
    defaultErrorHandler()
): Promise<boolean> => {
  const { error } = await useAPIFetch(options);

  if (error.value) {
    errorHandler(error.value);
    return false;
  }
  successHandler();
  return true;
};

export default useSubmitHandler;
