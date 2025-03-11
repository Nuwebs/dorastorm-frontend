<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { useSlots, type HTMLAttributes } from 'vue';
import { type ButtonVariants, buttonVariants } from '.';
import { cn } from '~/lib/utils';

interface UiButtonProps extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  as: 'button'
});
const slots = useSlots();
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="loading || disabled"
  >
    <Loader2
      v-if="loading"
      class="w-4 h-4 animate-spin"
      :class="{ 'mr-2': !slots.default }"
    />
    <slot />
  </Primitive>
</template>
