<script setup lang="ts">
import {
  Pagination,
  PaginationList,
  PaginationListItem,
  UiPaginationFirst,
  UiPaginationLast,
  UiPaginationEllipsis,
  UiPaginationNext,
  UiPaginationPrev
} from '.';
import UiButton from '../button/UiButton.vue';

const page = defineModel<number>({
  required: false
});

defineProps<{
  totalItems: number;
  itemsPerPage: number;

  siblingCount?: number;
  disabled?: boolean;
}>();
</script>
<template>
  <Pagination
    v-slot="{ page: pageSlot }"
    v-model:page="page"
    :items-per-page="itemsPerPage"
    :total="totalItems"
    :sibling-count="siblingCount ?? 2"
    show-edges
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <UiPaginationFirst />
      <UiPaginationPrev />

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <UiButton
            class="w-10 h-10 p-0"
            :variant="item.value === pageSlot ? 'default' : 'outline'"
          >
            {{ item.value }}
          </UiButton>
        </PaginationListItem>
        <UiPaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <UiPaginationNext />
      <UiPaginationLast />
    </PaginationList>
  </Pagination>
</template>
