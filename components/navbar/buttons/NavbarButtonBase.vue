<template>
  <Button
    text
    plain
    :icon="props.icon"
    rounded
    class="m-center"
    :aria-label="props.aLabel"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  icon: string;
  aLabel: string;
}

const props = defineProps<Props>();
</script>
<style scoped>
.m-center {
  top: 2px;
}
</style>
