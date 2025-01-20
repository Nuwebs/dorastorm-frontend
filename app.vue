<script setup lang="ts">
import { Toast, useToast, ConfirmDialog } from 'primevue';
import { onMounted, watch } from 'vue';
import useExternalToastStore from './stores/external-toast-store';
import { useI18n } from '#imports';

const toastStore = useExternalToastStore();
const toast = useToast();
const { t } = useI18n();

function renderComposablesToast() {
  toastStore.processToasts(toast.add, t);
}

onMounted(() => {
  renderComposablesToast();
});

watch(toastStore._toasts, () => {
  renderComposablesToast();
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
  <ConfirmDialog />
</template>

<style>
.main-section {
  min-height: 88vh;
}

.mobilebar-drawer-h {
  min-height: 20rem;
}
</style>
