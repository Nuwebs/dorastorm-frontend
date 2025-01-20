import type { ToastMessageOptions } from 'primevue/toast';
import { ref } from 'vue';
import { defineStore } from '#imports';

type ToastFunction = (payload: ToastMessageOptions) => void;
type TFunction = (key: string | number) => string;
const useExternalToastStore = defineStore('composablesToast', () => {
  const _toasts = ref<ToastMessageOptions[]>([]);

  function addToast(payload: ToastMessageOptions): void {
    _toasts.value.push(payload);
  }

  function processToasts(
    toastCallback: ToastFunction,
    tCallback: TFunction
  ): void {
    _toasts.value.forEach((toast) => {
      toast.detail = tCallback(toast.detail);
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
