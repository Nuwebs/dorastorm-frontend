<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import { DrawerContent, DrawerPortal } from 'vaul-vue';
import type { HtmlHTMLAttributes } from 'vue';
import DrawerOverlay from './UiDrawerOverlay.vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  DialogContentProps & { class?: HtmlHTMLAttributes['class'] }
>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwarded"
      :class="
        cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
          props.class
        )
      "
    >
      <div
        class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-zinc-100 dark:bg-zinc-800"
      />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
