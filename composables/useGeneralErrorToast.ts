import { useToast } from "primevue/usetoast";
import { useNuxtApp } from "#imports";
import { ToastMessageOptions } from "primevue/toast";

const useGeneralErrorToast = (): ToastMessageOptions => {
  const t = useNuxtApp().$i18n.t;
  return {
    severity: "error",
    detail: t("error.fatal"),
    life: 3000,
  };
};

export default useGeneralErrorToast;