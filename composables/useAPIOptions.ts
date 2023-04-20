import { useRuntimeConfig } from "nuxt/app";

const useAPIOptions = () => {
  const config = useRuntimeConfig();
  return {
    baseURL: config.public.backendURL as string,
  };
};

export default useAPIOptions;
