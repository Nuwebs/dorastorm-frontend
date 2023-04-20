import useAPIOptions from "./useAPIOptions";
import useAuthStore from "~/stores/authStore";

const useAuthOptions = () => {
  const baseOptions = useAPIOptions();
  const apiOptions = {
    ...baseOptions,
    headers: {
      Authorization: `Bearer ${useAuthStore().token}`,
    },
  };
  return apiOptions;
};

export default useAuthOptions;
