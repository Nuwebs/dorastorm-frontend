<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const modelValue = defineModel<string | number | null | undefined>({
  required: true
});

const props = defineProps<{
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  invalid?: boolean;
  rows?: number;
}>();
</script>

<template>
  <textarea
    v-model="modelValue"
    :disabled="disabled"
    :rows="rows ?? 5"
    :class="
      cn(
        'flex min-h-20 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
        props.invalid && 'border-red-500 dark:border-red-400',
        props.class
      )
    "
  />
</template>
