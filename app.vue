<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script setup lang="ts">
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
  background-color: var(--surface-section);
  opacity: 0.8;
}
</style>
