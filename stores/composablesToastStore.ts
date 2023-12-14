import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ToastMessageOptions } from 'primevue/toast';

type ToastFunction = (payload: ToastMessageOptions) => void;
type TFunction = (key: string | number) => string;
const useComposablesToastStore = defineStore('composablesToast', () => {
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

export default useComposablesToastStore;
