<script setup lang="ts">
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent
} from 'primevue';
import type { MenuItem } from 'primevue/menuitem';

defineProps<{
  item: MenuItem;
}>();

const emit = defineEmits<{
  navigated: [];
}>();
</script>

<template>
  <Accordion :value="0">
    <AccordionPanel
      v-for="(subitem, index) in item.items"
      :key="`dr-${subitem.label}-${index}`"
      :value="index"
    >
      <template v-if="subitem.items">
        <AccordionHeader>{{ subitem.label }}</AccordionHeader>
        <AccordionContent>
          <MobileBarItemAccordion
            :item="subitem"
            @navigated="emit('navigated')"
          />
        </AccordionContent>
      </template>
      <NuxtLink
        v-else
        :to="subitem.to"
        class="font-semibold font-lg text mb-2"
        @click="emit('navigated')"
      >
        <AccordionHeader :pt="{ toggleicon: { class: '!hidden' } }">
          {{ subitem.label }}
        </AccordionHeader>
      </NuxtLink>
    </AccordionPanel>
  </Accordion>
</template>

<style scoped></style>
