<script setup lang="ts">
import UiAlertDialogProvider from './components/ui/alert-dialog/UiAlertDialogProvider.vue';
import { Toaster } from './components/ui/toast';
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
</style>
