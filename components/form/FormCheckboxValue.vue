<script setup lang="ts" generic="T = string">
import { useField, ErrorMessage } from 'vee-validate';
import { computed } from 'vue';
import UiCheckbox from '../ui/checkbox/UiCheckbox.vue';

const props = defineProps<{
  modelValue: T[];

  name: string;
  label: T;
}>();

const { value, errorMessage } = useField<typeof props.modelValue>(
  props.name,
  undefined,
  {
    syncVModel: true
  }
);

// Compute whether the checkbox is checked
const isChecked = computed<boolean>(() => value.value.includes(props.label));

// Handle checkbox state changes
function handleUpdate(checked: boolean | 'indeterminate'): void {
  if (checked === 'indeterminate' || checked === false) {
    value.value = value.value.filter((v) => v !== props.label);
  } else {
    if (!isChecked.value) {
      value.value = [...value.value, props.label];
    }
  }
}
</script>

<template>
  <div class="items-top flex gap-x-2">
    <UiCheckbox
      :model-value="isChecked"
      :invalid="errorMessage !== undefined"
      @update:model-value="handleUpdate"
    />
    <div class="grid gap-1.5 leading-none">
      <slot name="label">
        <label :for="name" class="block">{{ label }}</label>
      </slot>
      <slot name="subLabel" />
      <slot name="errorMessage" :error-message-bag="errorMessage">
        <ErrorMessage :name="name" class="text-red-400" />
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
