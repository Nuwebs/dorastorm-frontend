import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Toast from 'primevue/toast';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.component("Toast", Toast);
    //other global components that you need
});