<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
    <Toast />
  </NuxtLayout>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
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
</style>
