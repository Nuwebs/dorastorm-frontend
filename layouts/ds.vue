<template>
  <TheDSNavbar class="ds-navbar" @sidebarButtonClick="sidebarVisible = !sidebarVisible" :full="shouldBeSidebar"/>
  <main class="p-3 min-h-fullscreen">
    <aside :class="sidebarClasses" v-if="shouldBeSidebar">
      <PanelMenu :model="sidebarMenuItems()" />
    </aside>
    <OverlaySidebar v-if="!shouldBeSidebar" v-model:visible="sidebarVisible">
      <PanelMenu :model="overlayMenu" />
    </OverlaySidebar>
    <article :class="contentClasses">
      <slot></slot>
    </article>
  </main>
  <ConfirmDialog />
</template>

<script setup lang="ts">
import TheDSNavbar from '~/components/TheDSNavbar.vue';
import { ref, computed, watch } from "vue";
import useWindowWidth from '~/composables/useWindowWidth';
import OverlaySidebar from "primevue/sidebar";
import { sidebarMenuItems, commonMenuOptions } from '~/services/menus';
import PanelMenu from "primevue/panelmenu";
import ConfirmDialog from 'primevue/confirmdialog';
import { useLocalePath, useRouter } from '#imports';
import { MenuItem } from 'primevue/menuitem';

const windowWidth = useWindowWidth();
const router = useRouter();
const currentRoute = router.currentRoute;
const lp = useLocalePath();

const shouldBeSidebar = ref<boolean>(windowWidth.value >= 992);
const sidebarVisible = ref<boolean>(shouldBeSidebar.value);

const sidebarClasses = computed<string>(() => {
  const baseClasses = 'layout-sidebar p-3 shadow-1';
  return sidebarVisible.value ? baseClasses : baseClasses + ' layout-sidebar-hidden';
});

const contentClasses = computed<string>(() => {
  let classes = 'p-3 shadow-1 surface-section';
  if (shouldBeSidebar.value) classes += ' layout-content';
  if (!sidebarVisible.value) classes += ' ml-0';
  return classes;
});

const overlayMenu = computed<MenuItem[]>(() => {
  return [
    {
      label: "Inicio",
      icon: "pi pi-home",
      to: lp("/ds")
    },
    ...sidebarMenuItems(),
    ...commonMenuOptions(),
  ];
})

watch(windowWidth, () => {
  if (windowWidth.value >= 992) {
    shouldBeSidebar.value = true;
    sidebarVisible.value = true;
  } else {
    shouldBeSidebar.value = false;
    sidebarVisible.value = false;
  };
});

watch(currentRoute, () => {
  if (!shouldBeSidebar.value && sidebarVisible.value) sidebarVisible.value = false;
})
</script>
<style scoped>
.ds-navbar {
  position: sticky;
  top: 0;
}

.layout-sidebar {
  position: fixed;
  width: 300px;
  overflow-y: auto;
  height: calc(88vh - 2rem);
  transition: transform .2s, left .2s;
  background-color: var(--surface-a);
}

.layout-sidebar-hidden {
  left: 0;
  transform: translate(-100%);
}

.layout-content {
  margin-left: calc(300px + 1rem);
  transition: margin-left .2s;
}
</style>