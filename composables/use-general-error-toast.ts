import type { ToastMessageOptions } from 'primevue/toast';
import { useNuxtApp } from '#imports';

// TODO: Convert it to an util
const useGeneralErrorToast = (): ToastMessageOptions => {
  const t = useNuxtApp().$i18n.t;
  return {
    severity: 'error',
    detail: t('error.fatal'),
    life: 5000
  };
};

export default useGeneralErrorToast;
