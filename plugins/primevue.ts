import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.component('Toast', Toast);
  nuxtApp.vueApp.use(ConfirmationService);
  // other global components that you need
});
