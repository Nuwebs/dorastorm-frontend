<script setup lang="ts">
import {
  NavigationMenuList,
  type NavigationMenuListProps,
  useForwardProps
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  NavigationMenuListProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <NavigationMenuList
    v-bind="forwardedProps"
    :class="cn('relative flex', props.class)"
  >
    <slot />
  </NavigationMenuList>
</template>
