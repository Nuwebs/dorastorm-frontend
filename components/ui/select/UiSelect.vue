<script setup lang="ts" generic="T extends Record<string, AcceptableValue>">
import { Loader2 } from 'lucide-vue-next';
import { SelectValue, SelectIcon, type AcceptableValue } from 'reka-ui';
import { computed, ref } from 'vue';
import {
  UiSelectRoot,
  UiSelectTrigger,
  UiSelectContent,
  UiSelectItem,
  UiSelectGroup,
  UiSelectLabel
} from '.';
import UiInput from '../input/UiInput.vue';

const props = defineProps<{
  modelValue: T[keyof T] | null;
  options: T[];

  valueKey: keyof T;
  labelKey: keyof T;

  groupBy?: keyof T;
  loading?: boolean;
  disabled?: boolean;
  filter?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: AcceptableValue];
}>();

const filterText = ref<string | null>(null);

const filteredOptions = computed(() => {
  if (!props.filter || !filterText.value) {
    return props.options; // Si no hay filtro o el texto está vacío, mostrar todas las opciones
  }
  const lowerFilter = filterText.value.toLowerCase();
  return props.options.filter((option) =>
    String(option[props.labelKey]).toLowerCase().includes(lowerFilter)
  );
});

// Computes the selected option and label
const selectedOption = computed(() =>
  props.options.find((option) => option[props.valueKey] === props.modelValue)
);
const selectedLabel = computed(() =>
  selectedOption.value
    ? selectedOption.value[props.labelKey]
    : props.placeholder ?? '...'
);

// Computes the groups if possible
const groups = computed(() => {
  if (!props.groupBy) return null;

  const map = new Map<string, T[]>();
  filteredOptions.value.forEach((option) => {
    const groupKey = String(option[props.groupBy!]); // As string to simplify
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
    <!-- Trigger: shows the label or the placeholder -->
    <UiSelectTrigger>
      <SelectIcon v-if="loading">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
      </SelectIcon>
      <SelectValue>
        {{ selectedLabel }}
      </SelectValue>
    </UiSelectTrigger>

    <UiSelectContent>
      <!-- If the user wants to filter -->
      <UiInput
        v-if="props.filter"
        v-model="filterText"
        type="text"
        class="w-full mb-4"
      />

      <!-- If there are groups -->
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

      <template v-else>
        <UiSelectItem
          v-for="(option, index) in filteredOptions"
          :key="`i-${index}`"
          :value="option[valueKey]"
        >
          {{ option[labelKey] }}
        </UiSelectItem>
      </template>
    </UiSelectContent>
  </UiSelectRoot>
</template>
