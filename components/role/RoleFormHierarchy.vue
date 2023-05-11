<template>
  <div v-if="!loading">
    <ul class="slist">
      <li v-for="(role, index) in availableRoles" :key="role.id" :draggable="role.id === selected"
        @dragstart="dragStart(index)"
        :class="[{ 'hint': dragging && iDragging !== index && role.hierarchy > userHierarchy, 'active': dragging && iEnter === role.id && role.hierarchy > userHierarchy }]"
        @dragend="dragging = false" @dragenter="iEnter = role.id" @dragover.prevent @drop.prevent="drop(index)">
        {{ role.id === selected ? role.name + "*" : role.name }}
      </li>
    </ul>
  </div>
  <TheLoadingSpinner v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAPIFetch, useGeneralErrorToast, useI18n } from "#imports";
import { Role } from "~/types/dorastorm";
import { useToast } from "primevue/usetoast";
import TheLoadingSpinner from "../TheLoadingSpinner.vue";
import useAuthStore from "~/stores/authStore";

interface Props {
  modelValue: number,
  updating: boolean
}

type RoleHierarchy = {
  id: number,
  name: string,
  hierarchy: number
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const toast = useToast();
const { t } = useI18n();
const authStore = useAuthStore();

const loading = ref<boolean>(false);
const availableRoles = ref<RoleHierarchy[]>([]);
const userRole = authStore.user!.role;
const selected = ref<number>(userRole.id);
const userHierarchy = ref<number>(userRole.hierarchy);
const dragging = ref<boolean>(false);
const iDragging = ref<number>(0);
const iEnter = ref<number>(0);

function dragStart(liId: number): void {
  dragging.value = true;
  iDragging.value = liId;
}
function drop(droppedPosition: number): void {
  if (iDragging.value === droppedPosition) return;
  if (availableRoles.value[droppedPosition].hierarchy <= userHierarchy.value) return;
  const roleToInsert = availableRoles.value[iDragging.value];
  availableRoles.value.splice(iDragging.value, 1);
  availableRoles.value.splice(droppedPosition, 0, roleToInsert);
  const prevRole = availableRoles.value[droppedPosition - 1];
  emit("update:modelValue", prevRole.hierarchy + 1);
}

onMounted(async () => {
  loading.value = true;
  const { error, data } = await useAPIFetch<Role[]>({
    endpoint: "/users/rolesbelow"
  });
  loading.value = false;
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }

  let roles: RoleHierarchy[] = data.value!
    .map((role): RoleHierarchy => {
      return {
        id: role.id,
        name: role.name,
        hierarchy: role.hierarchy
      }
    });
  if (!props.updating) {
    let maxHierarchy = roles.reduce((max, obj) => {
      return obj.hierarchy > max ? obj.hierarchy : max;
    }, -Infinity);
    maxHierarchy = maxHierarchy > 0 ? maxHierarchy + 1 : 1
    roles.push({
      id: -1,
      name: t("modules.roles.new_role"),
      hierarchy: maxHierarchy
    });
    selected.value = -1;
  }
  availableRoles.value = roles;
});
</script>
<style scoped>
/* (A) LIST STYLES */
.slist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.slist li {
  margin: 10px;
  padding: 15px;
  border: 1px solid #dfdfdf;
  background: #f5f5f5;
}

/* (B) DRAG-AND-DROP HINT */
.slist li.hint {
  border: 1px solid #ffc49a;
  background: #feffb4;
}

.slist li.active {
  border: 1px solid #ffa5a5;
  background: #ffe7e7;
}
</style>