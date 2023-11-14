<template>
  <NavbarBase>
    <template #start v-if="props.full">
      <div class="flex align-items-center mr-2">
        <NavbarButtonSidebar @click="$emit('sidebarButtonClick')" />
        <NavbarButtonHome @click="router.push(lp('/ds'))" />
      </div>
    </template>
    <template #end v-if="props.full">
      <NavbarButtonOptions :options="commonMenuOptions()" />
    </template>
    <template #end v-else>
      <NavbarButtonSidebar @click="$emit('sidebarButtonClick')" />
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import NavbarBase from "./navbar/NavbarBase.vue";
import NavbarButtonSidebar from "./navbar/buttons/NavbarButtonSidebar.vue";
import NavbarButtonHome from "./navbar/buttons/NavbarButtonHome.vue";
import NavbarButtonOptions from "./navbar/buttons/NavbarButtonOptions.vue";
import { useRouter, useLocalePath } from "#imports";
import { commonMenuOptions } from "~/services/menus";

const props = defineProps<{
  full: boolean;
}>();

const router = useRouter();
const lp = useLocalePath();
</script>