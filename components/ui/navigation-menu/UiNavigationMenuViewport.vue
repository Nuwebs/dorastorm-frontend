<script setup lang="ts">
import {
  NavigationMenuViewport,
  type NavigationMenuViewportProps,
  useForwardProps
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  NavigationMenuViewportProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <NavigationMenuViewport
    v-bind="forwardedProps"
    :class="
      cn(
        'absolute max-w-[700px] left-[--reka-navigation-menu-viewport-left]',
        props.class
      )
    "
  />
</template>
