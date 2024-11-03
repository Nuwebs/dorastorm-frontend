<script setup lang="ts">
interface Props {
  icon: string;
  aLabel: string;
}

const props = defineProps<Props>();
</script>

<template>
  <Button
    text
    plain
    :icon="props.icon"
    class="m-center"
    :aria-label="props.aLabel"
  />
</template>

<style scoped>
.m-center {
  top: 2px;
}
</style>
