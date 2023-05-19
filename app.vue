<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
  <Toast />
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import { onMounted, watch } from "vue";
import useComposablesToastStore from "./stores/composablesToastStore";
import { useToast } from "primevue/usetoast";
import { useI18n } from "#imports";

const toastStore = useComposablesToastStore();
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
<style>
body {
  margin: 0;
  background-color: var(--surface-ground);
}

.nlink {
  text-decoration: none;
  color: var(--text-color);
  transition: color 0.3s ease-in-out;
  border-bottom: 2px solid transparent;
}

.nlink:hover {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.p-component-overlay {
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
