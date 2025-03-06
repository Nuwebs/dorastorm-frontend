<script setup lang="ts">
import { AlertDialogAction, type AlertDialogActionProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { buttonVariants, type ButtonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const props = defineProps<
  AlertDialogActionProps & {
    class?: HTMLAttributes['class'];
    buttonVariant?: ButtonVariants['variant'];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, buttonVariant: __, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="cn(buttonVariants({ variant: buttonVariant }), props.class)"
  >
    <slot />
  </AlertDialogAction>
</template>
