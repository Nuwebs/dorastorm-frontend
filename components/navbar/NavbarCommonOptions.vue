<template>
  <NavbarCommonOptionsButton @click.stop.prevent="toggle" id="actions"/>
  <ContextMenu ref="ncoMenu" :model="commonMenuOptions()" popup />
</template>

<script setup lang="ts">
import ContextMenu from 'primevue/contextmenu';
import { commonMenuOptions } from "~/services/menus";
import { ref } from "vue";
const ncoMenu = ref();

// Idea taken from: https://github.com/primefaces/primevue/issues/2765#issuecomment-1179301695
// because TieredMenu does not work properly. Items go out of bounds.
const toggle = () => {
  const el = document.querySelector('#actions');
  const coords = el!.getBoundingClientRect();

  const event = new PointerEvent('click', {
    clientX: (coords.x + coords.width),
    clientY: (coords.y + coords.height),
  });
  ncoMenu.value.toggle(event);
};
</script>