<template>
  <div class="mb-2">
    <label class="block" :for="name">{{ props.label }}</label>
    <Calendar class="w-full" :model-value="value" @update:model-value="handler" :inline="props.inline"
      :show-icon="props.showIcon" :min-date="props.minDate" :max-date="props.maxDate" :date-format="props.dateFormat"
      :class="{ 'p-invalid': errorMessage }" @date-select="handler" />
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import Calendar from "primevue/calendar";
import { useField } from "vee-validate";
import { ErrorMessage } from "vee-validate";
import dayjs from "dayjs";

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
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const { value, errorMessage } = useField<null | string | Date>(() => props.name);

function handler(nValue: undefined | null | string | Date): void {
  value.value = nValue ? nValue : null;
  if (nValue === undefined || nValue === null) {
    return emit("update:modelValue", null);
  }
  if (props.toString) {
    return emit("update:modelValue", dayjs(nValue).format("YYYY-MM-DD"));
  }
  emit("update:modelValue", nValue);
}
</script>

<style scoped></style>