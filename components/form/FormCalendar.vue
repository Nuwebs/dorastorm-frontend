<template>
  <div class="mb-2">
    <label class="block" :for="name">{{ props.label }}</label>
    <Calendar
      class="w-full"
      :model-value="value"
      :inline="props.inline"
      :show-icon="props.showIcon"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :date-format="props.dateFormat"
      :class="{ 'p-invalid': errorMessage }"
      :time-only="!!props.timeOnly"
      hour-format="12"
      @update:model-value="handler"
      @date-select="handler"
    />
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import Calendar from 'primevue/calendar';
import { useField, ErrorMessage } from 'vee-validate';

import dayjs from 'dayjs';

interface Props {
  name: string;
  label: string;
  dateFormat: string;
  modelValue?: null | string | Date;
  toString?: boolean;
  showIcon?: boolean;
  inline?: boolean;
  minDate?: Date;
  maxDate?: Date;
  timeOnly?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const { value, errorMessage } = useField<null | string | Date>(
  () => props.name,
  undefined,
  {
    syncVModel: true
  }
);

function handler(nValue: undefined | null | string | Date): void {
  value.value = nValue || null;
  if (nValue === undefined || nValue === null) {
    return emit('update:modelValue', null);
  }
  if (props.toString) {
    return emit('update:modelValue', dayjs(nValue).format('YYYY-MM-DD'));
  }
  emit('update:modelValue', nValue);
}
</script>

<style scoped></style>
