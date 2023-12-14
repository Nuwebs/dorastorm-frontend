<template>
  <NavbarBase>
    <template v-if="props.full" #start>
      <div class="flex align-items-center mr-2">
        <NavbarButtonSidebar @click="emit('sidebarButtonClick')" />
        <NavbarButtonHome @click="navigateTo(lp('/ds'))" />
      </div>
    </template>
    <template v-if="props.full" #end>
      <NavbarButtonOptions :options="commonMenuOptions()" />
    </template>
    <template v-else #end>
      <NavbarButtonSidebar @click="emit('sidebarButtonClick')" />
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import NavbarBase from './navbar/NavbarBase.vue';
import NavbarButtonSidebar from './navbar/buttons/NavbarButtonSidebar.vue';
import NavbarButtonHome from './navbar/buttons/NavbarButtonHome.vue';
import NavbarButtonOptions from './navbar/buttons/NavbarButtonOptions.vue';
import { useLocalePath, navigateTo } from '#imports';
import { commonMenuOptions } from '~/services/menus';

const props = defineProps<{
  full: boolean;
}>();

const emit = defineEmits<{
  sidebarButtonClick: [];
}>();

const lp = useLocalePath();
</script>
