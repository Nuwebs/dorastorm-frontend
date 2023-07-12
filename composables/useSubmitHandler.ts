import { useToast } from "primevue/usetoast";
import { ApiFetch } from "~/types";
import useAPIFetch from "./useAPIFetch";
import useGeneralErrorToast from "./useGeneralErrorToast";
import { FetchError } from "ofetch";

const defaultErrorHandler = (): void => {
  const toast = useToast();
  toast.add(useGeneralErrorToast());
};

const useSubmitHandler = async (
  options: ApiFetch<void>,
  successHandler: () => void,
  errorHandler: (error: FetchError) => void = () => defaultErrorHandler()
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
