import { useI18n } from '#imports';
import type { ToastMessageOptions } from 'primevue';

export default function useGenericToastMessages() {
  const { t } = useI18n();

  function getGeneric404Message(): ToastMessageOptions {
    return {
      severity: 'error',
      summary: t('error.404.default_title'),
      detail: t('error.404.default_resource'),
      life: 10000
    };
  }

  function getGeneric403Message(): ToastMessageOptions {
    return {
      severity: 'error',
      summary: t('error.403.default_title'),
      detail: t('error.403.default_message'),
      life: 10000
    };
  }

  function getGenericErrorMessage(detailedError?: string): ToastMessageOptions {
    return {
      severity: 'error',
      summary: t('error.fatal'),
      detail: detailedError
    };
  }

  return {
    getGeneric403Message,
    getGeneric404Message,
    getGenericErrorMessage
  };
}
