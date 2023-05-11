<template>
  <section class="p-container">
    <RoleFormContainer v-model="newRole"/>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import PERMISSIONS from '~/utils/permissions';
import RoleFormContainer from '~/components/role/RoleFormContainer.vue';
import { ref } from 'vue';
import { NewRole } from '~/types/dorastorm';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.ROLES_CREATE]
});

const newRole = ref<NewRole>({
  name: "",
  description: "",
  hierarchy: -1,
  permissions: []
});
</script>