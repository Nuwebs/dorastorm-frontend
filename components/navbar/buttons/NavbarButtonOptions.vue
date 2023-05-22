<template>
  <NavbarButtonBase icon="pi pi-cog" a-label="Options" @click.stop.prevent="toggle" id="actions"/>
  <ContextMenu ref="ncoMenu" :model="props.options" popup />
</template>

<script setup lang="ts">
import NavbarButtonBase from './NavbarButtonBase.vue';
import ContextMenu from 'primevue/contextmenu';
import { MenuItem } from 'primevue/menuitem';
import { ref } from "vue";

interface Props {
  options: MenuItem[]
}

const props = defineProps<Props>();
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