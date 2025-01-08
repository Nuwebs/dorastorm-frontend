<script setup lang="ts">
import { navigateTo } from '#app';
import { useLocalePath } from '#imports';
import { Button } from 'primevue';
import { ref } from 'vue';
import useAuthStore from '~/stores/auth-store';

defineProps<{
  isSidebarCollapsed: boolean;
}>();

const emit = defineEmits<{
  sidebarButtonClicked: [];
}>();

const authStore = useAuthStore();
const lp = useLocalePath();
const loggingOut = ref<boolean>(false);

async function logout(): Promise<void> {
  if (loggingOut.value) return;

  loggingOut.value = true;
  await authStore.logout();
  navigateTo(lp('/'));

  loggingOut.value = false;
}
</script>

<template>
  <aside
    :class="[
      'bg-surface-100 border-r border-gray-500 flex flex-col transition-all duration-300',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <slot name="sidebarHeader" :user="authStore.user">
      <div class="w-full flex items-center h-20 border-b border-gray-500 p-3">
        <div class="mr-auto">
          {{ authStore.user?.name }}
        </div>
        <Button icon="pi pi-bars" plain @click="emit('sidebarButtonClicked')" />
      </div>
    </slot>

    <div class="mt-auto">
      <slot name="sidebarFooter">
        <div
          class="w-full flex items-center cursor-pointer px-3 py-4 border-t border-gray-500"
          @click="logout"
        >
          <div class="mr-auto">Cerrar sesión</div>
          <i
            :class="`pi ${loggingOut ? 'pi-spin pi-spinner' : 'pi-sign-out'}`"
          />
        </div>
      </slot>
    </div>
  </aside>
</template>

<style scoped></style>
