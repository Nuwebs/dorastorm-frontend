<template>
  <NavbarBase>
    <template #start>
      <div class="flex align-items-center mr-2">
        <h3 class="my-0 mr-2">Dorastorm</h3>
        <NavbarSidebarButton @click="$emit('sidebarButtonClick')"/>
        <NavbarHomeButton @click="router.push('/ds')"/>
      </div>
    </template>
    <template #end>
      <NavbarSignoutButton />
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import NavbarBase from "./navbar/NavbarBase.vue";
import NavbarSignoutButton from "./navbar/NavbarSignoutButton.vue";
import NavbarSidebarButton from "./navbar/NavbarSidebarButton.vue";
import NavbarHomeButton from "./navbar/NavbarHomeButton.vue";
import { useRouter } from "#imports";

const router = useRouter();
</script>