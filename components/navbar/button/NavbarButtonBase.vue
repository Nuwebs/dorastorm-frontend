<script setup lang="ts">
import UiButton from '~/components/ui/button/UiButton.vue';

interface Props {
  icon: string;
  aLabel: string;
}

const props = defineProps<Props>();
</script>

<template>
  <UiButton class="m-center" :aria-label="props.aLabel">
    {{ props.icon }}
  </UiButton>
</template>

<style scoped>
.m-center {
  top: 2px;
}
</style>
