<script setup lang="ts">
import {
  NavigationMenuRoot,
  type NavigationMenuRootEmits,
  type NavigationMenuRootProps,
  useForwardPropsEmits
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import UiNavigationMenuViewport from './UiNavigationMenuViewport.vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  NavigationMenuRootProps & { class?: HTMLAttributes['class'] }
>();

const emits = defineEmits<NavigationMenuRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <NavigationMenuRoot v-bind="forwarded" :class="cn('relative', props.class)">
    <slot />
    <UiNavigationMenuViewport />
  </NavigationMenuRoot>
</template>
