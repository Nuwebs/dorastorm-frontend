<script setup lang="ts">
import { ref } from 'vue';
import { createError, useAsyncData, useI18n } from '#imports';
import { UserService } from '~/services/user-service';
import useAuthStore from '~/stores/auth-store';
import type { Role } from '~/types/role';

interface Props {
  modelValue: number;
  updating: boolean;
}

type RoleHierarchy = {
  id: number;
  name: string;
  hierarchy: number;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [payload: number];
}>();

const { t } = useI18n();
const { user } = useAuthStore();

const userService = new UserService();
const userRole = user!.role;
const userHierarchy = ref<number>(userRole.hierarchy);

const selected = ref<number>(-1);
const dragging = ref<boolean>(false);
const iDragging = ref<number>(0);
const iEnter = ref<number>(0);

const { data, error } = await useAsyncData(() => userService.getRolesBelow());
const availableRoles = ref<RoleHierarchy[]>(processRoles(data.value ?? []));

if (error.value) {
  throw createError({
    statusCode: 403,
    statusMessage: t('error.403.default_message'),
    fatal: true
  });
}

function processRoles(data: Role[]): RoleHierarchy[] {
  const roles: RoleHierarchy[] = data.map((role): RoleHierarchy => {
    return {
      id: role.id,
      name: role.name,
      hierarchy: role.hierarchy
    };
  });
  if (!props.updating) {
    let maxHierarchy = roles.reduce((max: number, obj: RoleHierarchy) => {
      return obj.hierarchy > max ? obj.hierarchy : max;
    }, -Infinity);
    maxHierarchy = maxHierarchy > 0 ? maxHierarchy + 1 : 1;
    roles.push({
      id: -1,
      name: t('modules.roles.new_role'),
      hierarchy: maxHierarchy
    });
    selected.value = -1;
    emit('update:modelValue', maxHierarchy);
  } else {
    const found = roles.find(
      (role: RoleHierarchy) => role.hierarchy === props.modelValue
    );
    if (found) {
      selected.value = found.id;
    }
  }
  return roles;
}

function dragStart(liId: number): void {
  dragging.value = true;
  iDragging.value = liId;
}

function drop(droppedPosition: number): void {
  if (iDragging.value === droppedPosition) {
    return;
  }
  if (availableRoles.value[droppedPosition].hierarchy <= userHierarchy.value) {
    return;
  }
  const roleToInsert = availableRoles.value[iDragging.value];
  availableRoles.value.splice(iDragging.value, 1);
  availableRoles.value.splice(droppedPosition, 0, roleToInsert);
  emit('update:modelValue', droppedPosition);
}
</script>
<template>
  <ul class="slist p-1 border rounded">
    <li
      v-for="(role, index) in availableRoles"
      :key="role.id"
      class="p-2 m-2 text-center rounded border bg-gray-100"
      :draggable="role.id === selected"
      :class="[
        {
          'bg-primary': role.id === selected,
          'border border-dashed border-green-900':
            dragging && role.id !== selected && role.hierarchy > userHierarchy,
          'bg-green-100':
            dragging && iDragging !== index && role.hierarchy > userHierarchy,
          'bg-green-300':
            dragging && iEnter === role.id && role.hierarchy > userHierarchy
        }
      ]"
      @dragstart="dragStart(index)"
      @dragend="dragging = false"
      @dragenter="iEnter = role.id"
      @dragover.prevent
      @drop.prevent="drop(index)"
    >
      {{ role.id === selected ? role.name + '*' : role.name }}
    </li>
  </ul>
</template>
