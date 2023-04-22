<template>
  <DefaultLayout>
    <NuxtPage></NuxtPage>
    <Toast/>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from "~/layouts/default.vue";
import Toast from "primevue/toast";
</script>
<style>
body {
  margin: 0;
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
