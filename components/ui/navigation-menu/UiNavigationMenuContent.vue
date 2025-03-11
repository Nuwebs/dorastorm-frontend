<script setup lang="ts">
import {
  NavigationMenuContent,
  type NavigationMenuContentEmits,
  type NavigationMenuContentProps,
  useForwardPropsEmits
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = defineProps<
  NavigationMenuContentProps & { class?: HTMLAttributes['class'] }
>();

const emits = defineEmits<NavigationMenuContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <NavigationMenuContent
    v-bind="forwarded"
    :class="
      cn(
        'border border-t-0 border-gray-500 bg-white p-4 rounded rounded-t-none',
        props.class
      )
    "
  >
    <slot />
  </NavigationMenuContent>
</template>
