<script setup lang="ts">
import { watch } from 'vue';
import UiAlertDialogProvider from './components/ui/alert-dialog/UiAlertDialogProvider.vue';
import { Toaster, useToast } from './components/ui/toast';
import useExternalToastStore from './stores/external-toast-store';
import { useI18n } from '#imports';

const toastStore = useExternalToastStore();
const { toast } = useToast();
const { t } = useI18n();

function renderComposablesToast() {
  toastStore.processToasts(toast, t);
}

if (import.meta.client) {
  watch(toastStore._toasts, () => {
    renderComposablesToast();
  });
}
</script>

<template>
  <NuxtLoadingIndicator />
  <UiAlertDialogProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UiAlertDialogProvider>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>

<style>
.header-section {
  height: 12vh;
}

.main-section {
  min-height: 88vh;
}

.mobilebar-drawer-h {
  min-height: 20rem;
}

/** Default Lucide Icons config */
.lucide {
  width: 1.2rem;
  height: 1.2rem;
  stroke-width: 1.5px;
}
</style>
