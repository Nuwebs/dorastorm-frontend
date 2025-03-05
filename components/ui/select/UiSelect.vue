<script setup lang="ts" generic="T extends Record<string, AcceptableValue>">
import { Loader2 } from 'lucide-vue-next';
import type { AcceptableValue } from 'reka-ui';
import { computed } from 'vue';
import {
  UiSelectRoot,
  UiSelectTrigger,
  UiSelectContent,
  UiSelectItem,
  UiSelectGroup,
  UiSelectLabel
} from '.';

// Definimos las props con genéricos
const props = defineProps<{
  modelValue: T[keyof T] | null; // Valor seleccionado (v-model)
  options: T[]; // Array de objetos genéricos

  valueKey: keyof T; // Clave para el valor
  labelKey: keyof T; // Clave para la etiqueta

  groupBy?: keyof T; // Clave opcional para agrupar
  loading?: boolean;
  disabled?: boolean;
}>();

// Definimos los eventos emitidos
const emit = defineEmits<{
  'update:modelValue': [value: AcceptableValue];
}>();

// Computamos la opción seleccionada y su etiqueta
const selectedOption = computed(() =>
  props.options.find((option) => option[props.valueKey] === props.modelValue)
);
const selectedLabel = computed(() =>
  selectedOption.value
    ? selectedOption.value[props.labelKey]
    : 'Selecciona una opción'
);

// Computamos los grupos si se proporciona groupBy
const groups = computed(() => {
  if (!props.groupBy) return null;

  const map = new Map<string, T[]>();
  props.options.forEach((option) => {
    const groupKey = String(option[props.groupBy!]); // Convertimos a string para simplificar
    if (!map.has(groupKey)) {
      map.set(groupKey, []);
    }
    map.get(groupKey)!.push(option);
  });
  return map;
});
</script>

<template>
  <UiSelectRoot
    :model-value="props.modelValue"
    :disabled="disabled || loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- Trigger: muestra la etiqueta seleccionada o un placeholder -->
    <UiSelectTrigger>
      <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
      {{ selectedLabel }}
    </UiSelectTrigger>

    <!-- Contenido del Select -->
    <UiSelectContent>
      <!-- Si hay agrupaciones -->
      <template v-if="props.groupBy && groups">
        <UiSelectGroup
          v-for="[groupKey, groupOptions] in groups"
          :key="groupKey"
        >
          <UiSelectLabel>{{ groupKey }}</UiSelectLabel>
          <UiSelectItem
            v-for="(option, index) in groupOptions"
            :key="`g-${index}`"
            :value="option[valueKey]"
          >
            {{ option[labelKey] }}
          </UiSelectItem>
        </UiSelectGroup>
      </template>

      <!-- Sin agrupaciones -->
      <template v-else>
        <UiSelectItem
          v-for="(option, index) in options"
          :key="`i-${index}`"
          :value="option[valueKey]"
        >
          {{ option[labelKey] }}
        </UiSelectItem>
      </template>
    </UiSelectContent>
  </UiSelectRoot>
</template>
