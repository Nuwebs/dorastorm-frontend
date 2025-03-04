<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const modelValue = defineModel<string | number | undefined | null>({
  required: true
});

const props = defineProps<{
  class?: HTMLAttributes['class'];
  type: 'text' | 'password' | 'email' | 'file';
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}>();
</script>

<template>
  <input
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="
      cn(
        'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:placeholder:text-zinc-400',
        'border-zinc-200 dark:border-zinc-800',
        (props.invalid || modelValue === '') &&
          'border-red-500 dark:border-red-400',
        props.class
      )
    "
  />
</template>
