import { ref } from 'vue';
import { defineStore } from '#imports';
import type { Toast } from '~/components/ui/toast/use-toast';

type ToastFunction = (payload: Toast) => void;
type TFunction = (key: string | number) => string;
const useExternalToastStore = defineStore('composablesToast', () => {
  const _toasts = ref<Toast[]>([]);

  function addToast(payload: Toast): void {
    _toasts.value.push(payload);
  }

  function processToasts(
    toastCallback: ToastFunction,
    tCallback: TFunction
  ): void {
    _toasts.value.forEach((toast) => {
      toast.description = tCallback(String(toast.description));
      toastCallback(toast);
    });
    _toasts.value = [];
  }

  return {
    _toasts,
    addToast,
    processToasts
  };
});

export default useExternalToastStore;
