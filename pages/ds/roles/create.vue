<template>
  <section class="container">
    <h3 class="mb-2 mt-0">{{ $t("modules.roles.create") }}</h3>
    <RoleFormContainer v-model="newRole" :submit-handler="handler" />
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useGeneralErrorToast, useI18n, useSubmitHandler } from '#imports';
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

const handler = async () => await useSubmitHandler(
  {
    endpoint: "/roles",
    options: {
      method: "POST",
      body: newRole.value
    }
  },
  () => toast.add({
    severity: "success",
    detail: t("modules.roles.created"),
    life: 3000
  }),
  (error) => {
    if (error.statusCode === 422 && error.data.errors && error.data.errors.permissions) {
      toast.add({
        severity: "error",
        detail: t("error.422.specific.role_permissions"),
        life: 3000,
      })
    }
    toast.add(useGeneralErrorToast());
  }
);
</script>