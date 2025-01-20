<script setup lang="ts">
import { Checkbox } from 'primevue';
import { useField, ErrorMessage } from 'vee-validate';

const props = defineProps<{
  name: string;
  label: string;
  content: string;
  modelValue?: string[];
}>();

const { value, errorMessage } = useField<typeof props.modelValue>(
  props.name,
  undefined,
  {
    syncVModel: true
  }
);
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <Checkbox
        v-model="value"
        :value="props.content"
        :title="name"
        :invalid="errorMessage !== undefined"
      />
      <slot name="label">
        <label :for="name" class="block">{{ label }}</label>
      </slot>
    </div>
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
