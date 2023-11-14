<template>
  <div>
    <label :for="name" class="block mb-1">{{ label }}</label>
    <input type="file" :name="name" @change="handleChange" :id="name" :accept="accept">
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
  name: string;
  label: string;
  modelValue: File | null;
  accept: string;
}

const props = defineProps<Props>();

const { value } = useField<null | File>(() => props.name, undefined, {
  syncVModel: true
});

function handleChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files.length > 0) {
    value.value = inputElement.files[0];
  } else {
    value.value = null;
  }
}
</script>

<style scoped>
input::file-selector-button {
  font-weight: bold;
  color: white;
  padding: 0.5em;
  border: 0;
  background-color: var(--primary-color);
  border-radius: var(--border-radius) !important;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 1rem;
  min-width: 4rem;
  padding: 0.714rem 1rem;
  cursor: pointer;
}
</style>