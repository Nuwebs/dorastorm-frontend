<script setup lang="ts">
import {
  UiAccordion,
  UiAccordionItem,
  UiAccordionContent,
  UiAccordionTrigger
} from '../ui/accordion';
import type { DsMenuItem } from '~/types/menu';

defineProps<{
  item: DsMenuItem;
}>();

const emit = defineEmits<{
  navigated: [];
}>();
</script>

<template>
  <UiAccordion type="single" collapsible>
    <UiAccordionItem
      v-for="(subitem, index) in item.items"
      :key="`dr-${subitem.label}-${index}`"
      :value="`dr-${subitem.label}-${index}`"
      class="mb-2"
    >
      <template v-if="subitem.items">
        <UiAccordionTrigger>{{ subitem.label }}</UiAccordionTrigger>
        <UiAccordionContent>
          <MobileBarItemAccordion
            :item="subitem"
            class="pl-4"
            @navigated="emit('navigated')"
          />
        </UiAccordionContent>
      </template>
      <NuxtLinkLocale
        v-else
        :to="subitem.to"
        class="font-semibold font-lg text mb-2"
        @click="emit('navigated')"
      >
        {{ subitem.label }}
      </NuxtLinkLocale>
    </UiAccordionItem>
  </UiAccordion>
</template>

<style scoped></style>
