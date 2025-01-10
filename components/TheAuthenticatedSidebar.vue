<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';
import useAuthStore from '~/stores/auth-store';
import SidebarItemList from './sidebar/SidebarItemList.vue';
import { useLocalePath, navigateTo } from '#imports';
import type { MenuItem } from 'primevue/menuitem';

type SidebarStatus = 'collapsed' | 'expanded';

defineProps<{
  menu: MenuItem[];
}>();
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
      <header
        class="h-20 w-full flex items-center border-b border-gray-500 p-3"
        :class="{ 'justify-center': isSidebarCollapsed }"
      >
        <div v-if="!isSidebarCollapsed" class="mr-auto">
          {{ authStore.user?.name }}
        </div>
        <Button icon="pi pi-bars" plain @click="handleToggleButton" />
      </header>
    </slot>

    <section class="flex-1 overflow-y-auto">
      <slot name="sidebarContent">
        <SidebarItemList
          :menu="menu"
          :collapsed="isSidebarCollapsed"
          @expand-sidebar="toggleSidebarStatus('expanded')"
        />
      </slot>
    </section>

    <div class="mt-auto">
      <slot name="sidebarFooter">
        <footer
          class="w-full flex items-center cursor-pointer px-3 py-4 border-t border-gray-500"
          :class="{ 'justify-center': isSidebarCollapsed }"
          @click="logout"
        >
          <div v-if="!isSidebarCollapsed" class="mr-auto">
            {{ $t('general.logout') }}
          </div>
          <i
            :class="`pi ${loggingOut ? 'pi-spin pi-spinner' : 'pi-sign-out'}`"
          />
        </footer>
      </slot>
    </div>
  </aside>
</template>

<style scoped></style>
