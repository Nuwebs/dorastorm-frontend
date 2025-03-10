<script setup lang="ts">
import {
  NavigationMenuIndicator,
  type NavigationMenuIndicatorProps,
  useForwardProps
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  NavigationMenuIndicatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <NavigationMenuIndicator
    v-bind="forwardedProps"
    :class="
      cn(
        'absolute bottom-0 translate-x-[calc(var(--reka-navigation-menu-indicator-position)+var(--reka-navigation-menu-indicator-size)/2-6px)] border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-500',
        props.class
      )
    "
  />
</template>
