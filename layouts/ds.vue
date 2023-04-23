<template>
  <TheDSNavbar @sidebarButtonClick="sidebarVisible = !sidebarVisible" />
  <article class="grid grid-nogutter p-2 min-h-fullscreen">
    <aside class="layout-sidebar p-2 border-solid" v-if="sidebarVisible && shouldBeSidebar">
      <h1>contenido</h1>
    </aside>
    <OverlaySidebar v-if="!shouldBeSidebar" v-model:visible="sidebarVisible">
      <h1>test</h1>
    </OverlaySidebar>
    <main :class="contentClasses">
      <slot></slot>
    </main>
  </article>
</template>

<script setup lang="ts">
import TheDSNavbar from '~/components/TheDSNavbar.vue';
import { ref, computed, watch } from "vue";
import useWindowWidth from '~/composables/useWindowWidth';
import OverlaySidebar from "primevue/sidebar";


const windowWidth = useWindowWidth();
const shouldBeSidebar = ref<boolean>(windowWidth.value >= 992);
const sidebarVisible = ref<boolean>(shouldBeSidebar.value);

const contentClasses = computed<string>(() => {
  let classes = 'p-2 w-full border-solid';
  if (shouldBeSidebar.value) classes += ' layout-content';
  if (!sidebarVisible.value) classes += ' ml-0';
  return classes;
})

watch(windowWidth, () => {
  if (windowWidth.value >= 992) {
    shouldBeSidebar.value = true;
    sidebarVisible.value = true;
  } else {
    shouldBeSidebar.value = false;
    sidebarVisible.value = false;
  };
})
</script>
<style scoped>
.layout-sidebar {
  position: fixed;
  width: 300px;
  overflow-y: auto;
  height: calc(88vh - 1rem);
}

.layout-content {
  margin-left: calc(300px + 0.5rem);
}
</style>