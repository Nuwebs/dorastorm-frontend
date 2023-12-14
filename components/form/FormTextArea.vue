<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <Textarea
      v-model="value"
      class="w-full block"
      :name="name"
      :class="{ 'p-invalid': errorMessage }"
      :rows="props.rows"
    />
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea';
import { toRef } from 'vue';
import { useField } from 'vee-validate';

interface Props {
  name: string,
  label: string,
  rows?: number,
  autoResize?: boolean
  modelValue?: string
}
const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  autoResize: false
});

const { errorMessage, value } = useField<string>(toRef(props, 'name'), undefined, {
  syncVModel: true
});
</script>
