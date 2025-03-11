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

const positionStyle = computed<string>(() => {
  return `left: clamp(0px, var(--reka-navigation-menu-viewport-left), calc(100% - var(--reka-navigation-menu-viewport-width) * 1.25));`;
});
</script>

<template>
  <NavigationMenuViewport
    v-bind="forwardedProps"
    :class="cn('absolute max-w-[700px]', props.class)"
    :style="positionStyle"
  />
</template>
