import { ToastMessageOptions } from 'primevue/toast';
import { useNuxtApp } from '#imports';

const use403Toast = (): ToastMessageOptions => {
  const t = useNuxtApp().$i18n.t;
  return {
    severity: 'error',
    summary: t('error.403.default_message'),
    detail: t('error.403.default_title'),
    life: 3000
  };
};

export default use403Toast;
