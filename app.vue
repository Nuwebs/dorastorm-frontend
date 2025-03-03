<script setup lang="ts">
import { Toaster } from './components/ui/toast';
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>

<style>
.main-section {
  min-height: 88vh;
}

.mobilebar-drawer-h {
  min-height: 20rem;
}
</style>
