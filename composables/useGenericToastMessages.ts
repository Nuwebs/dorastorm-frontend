import { useI18n } from '#imports';
import type { Toast } from '~/components/ui/toast/use-toast';

export default function useGenericToastMessages() {
  const { t } = useI18n();

  function getGeneric404Message(): Toast {
    return {
      variant: 'destructive',
      title: t('error.404.default_title'),
      description: t('error.404.default_resource')
    };
  }

  function getGeneric403Message(): Toast {
    return {
      variant: 'destructive',
      title: t('error.403.default_title'),
      description: t('error.403.default_message')
    };
  }

  function getGenericErrorMessage(descriptionedError?: string): Toast {
    return {
      variant: 'destructive',
      title: t('error.fatal'),
      description: descriptionedError
    };
  }

  return {
    getGeneric403Message,
    getGeneric404Message,
    getGenericErrorMessage
  };
}
