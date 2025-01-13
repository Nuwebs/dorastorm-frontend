<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { Toast, useToast, ConfirmDialog } from 'primevue';
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
