import type { ToastMessageOptions } from 'primevue/toast';
import { useNuxtApp } from '#imports';

// TODO: Convert it to an util
const use404Toast = (): ToastMessageOptions => {
  const t = useNuxtApp().$i18n.t;
  return {
    severity: 'error',
    detail: t('error.404.default_resource'),
    life: 3000
  };
};

export default use404Toast;
