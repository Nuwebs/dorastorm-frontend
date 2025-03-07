<template>
  <div class="flex items-center justify-center">
    <div role="status" aria-label="Loading" :class="spinnerClass" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface SpinnerProps {
  size?: string;
}

const props = defineProps<SpinnerProps>();
const { size = '20' } = props;

const spinnerClass = computed(() => {
  return `w-${size} h-${size} border-4 border-zinc-500 animate-spin`;
});
</script>
