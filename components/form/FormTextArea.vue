<script setup lang="ts">
import { Textarea } from 'primevue';
import { useField, ErrorMessage } from 'vee-validate';

interface Props {
  name: string;
  label: string;
  rows?: number;
  autoResize?: boolean;
  modelValue?: string;
}
const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  autoResize: false
});

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
    <slot name="label">
      <label :for="name" class="block">{{ label }}</label>
    </slot>
    <Textarea
      v-model="value"
      :name="name"
      :rows="props.rows"
      :invalid="errorMessage !== undefined"
      class="w-full block"
    />
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
