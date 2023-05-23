<template>
  <section class="p-container">
    <h3 class="mb-2 mt-0">{{ $t("modules.roles.create") }}</h3>
    <RoleFormContainer v-model="newRole" :submit-handler="handler" />
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useAPIFetch, useGeneralErrorToast, useI18n } from '#imports';
import PERMISSIONS from '~/utils/permissions';
import RoleFormContainer from '~/components/role/RoleFormContainer.vue';
import { ref } from 'vue';
import { NewRole } from '~/types/dorastorm';
import { useToast } from 'primevue/usetoast';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.ROLES_CREATE]
});

const toast = useToast();
const newRole = ref<NewRole>({
  name: "",
  description: "",
  hierarchy: -1,
  permissions: []
});
const { t } = useI18n();

async function handler() {
  const { error } = await useAPIFetch<void>({
    endpoint: "/roles",
    options: {
      method: "POST",
      body: newRole.value
    }
  });
  if (error.value) {
    if (error.value.statusCode === 422 && error.value.data.errors && error.value.data.errors.permissions) {
      return toast.add({
        severity: "error",
        detail: t("error.422.specific.role_permissions"),
        life: 3000,
      })
    }
    return toast.add(useGeneralErrorToast());
  }
  toast.add({
    severity: "success",
    detail: t("modules.roles.created"),
    life: 3000
  });
}
</script>