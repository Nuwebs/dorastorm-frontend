<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';
import useAuthStore from '~/stores/auth-store';
import SidebarItemList from './sidebar/SidebarItemList.vue';
import { useLocalePath, navigateTo } from '#imports';
import type { DsMenuItem } from '~/types/menu';

type SidebarStatus = 'collapsed' | 'expanded';

const emit = defineEmits<{
  collapseStatusChange: [status: SidebarStatus];
}>();

const authStore = useAuthStore();
const lp = useLocalePath();

const isSidebarCollapsed = ref<boolean>(false);
const loggingOut = ref<boolean>(false);

function toggleSidebarStatus(status: SidebarStatus): void {
  isSidebarCollapsed.value = status === 'collapsed';
  emit('collapseStatusChange', status);
}

function handleToggleButton(): void {
  toggleSidebarStatus(isSidebarCollapsed.value ? 'expanded' : 'collapsed');
}

async function logout(): Promise<void> {
  if (loggingOut.value) return;

  loggingOut.value = true;
  await authStore.logout();
  navigateTo(lp('/'));

  loggingOut.value = false;
}

const test: DsMenuItem[] = [
  {
    name: 'Dashboard',
    to: '/home',
    icon: 'pi pi-home'
  },
  {
    name: 'Settings',
    icon: 'pi pi-cog',
    items: [
      { name: 'Test', to: '/test', icon: 'pi pi-user' },
      { name: 'Level 3', icon: 'pi pi-key', items: [{ name: 'Last' }] }
    ]
  },
  {
    name: 'Settings 2',
    icon: 'pi pi-cog',
    items: [
      { name: 'Test', to: '/test', icon: 'pi pi-user' },
      { name: 'Level 3', icon: 'pi pi-key', items: [{ name: 'Last' }] }
    ]
  },
  {
    name: 'Settings 3',
    icon: 'pi pi-cog',
    items: [
      { name: 'Test', to: '/test', icon: 'pi pi-user' },
      { name: 'Level 3', icon: 'pi pi-key', items: [{ name: 'Last' }] }
    ]
  },
  {
    name: 'Settings 4',
    icon: 'pi pi-cog',
    items: [
      { name: 'Test', to: '/test', icon: 'pi pi-user' },
      { name: 'Level 3', icon: 'pi pi-key', items: [{ name: 'Last' }] }
    ]
  },
  {
    name: 'Settings 5',
    icon: 'pi pi-cog',
    items: [
      { name: 'Test', to: '/test', icon: 'pi pi-user' },
      { name: 'Level 3', icon: 'pi pi-key', items: [{ name: 'Last' }] }
    ]
  }
];
</script>

<template>
  <aside
    :class="[
      'bg-surface-100 border-r border-gray-500 flex flex-col transition-all duration-300',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <slot
      name="sidebarHeader"
      :user="authStore.user"
      :sidebar-status-toggle-callback="toggleSidebarStatus"
    >
      <div
        class="w-full flex items-center h-20 border-b border-gray-500 p-3"
        :class="{ 'justify-center': isSidebarCollapsed }"
      >
        <div v-if="!isSidebarCollapsed" class="mr-auto">
          {{ authStore.user?.name }}
        </div>
        <Button icon="pi pi-bars" plain @click="handleToggleButton" />
      </div>
    </slot>

    <slot name="sidebarContent">
      <SidebarItemList
        :menu="test"
        :collapsed="isSidebarCollapsed"
        class="overflow-y-auto"
        @expand-sidebar="toggleSidebarStatus('expanded')"
      />
    </slot>

    <div class="mt-auto">
      <slot name="sidebarFooter">
        <div
          class="w-full flex items-center cursor-pointer px-3 py-4 border-t border-gray-500"
          :class="{ 'justify-center': isSidebarCollapsed }"
          @click="logout"
        >
          <div v-if="!isSidebarCollapsed" class="mr-auto">Cerrar sesión</div>
          <i
            :class="`pi ${loggingOut ? 'pi-spin pi-spinner' : 'pi-sign-out'}`"
          />
        </div>
      </slot>
    </div>
  </aside>
</template>

<style scoped></style>
