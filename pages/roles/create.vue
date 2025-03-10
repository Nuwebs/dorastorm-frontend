<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useI18n, useToast } from '#imports';
import RoleFormContainer from '~/components/role/form/RoleFormContainer.vue';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { PERMISSION } from '~/services/permission-service';
import { RoleService } from '~/services/role-service';
import type { NewRole } from '~/types/role';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_CREATE]
});

const toast = useToast();
const { getGeneric403Message, getGenericErrorMessage } =
  useGenericToastMessages();
const { t } = useI18n();
const service = new RoleService();
const newRole = ref<NewRole>({
  name: '',
  description: '',
  hierarchy: -1,
  permissions: []
});

async function submitHandler(): Promise<boolean> {
  const { error } = await service.handledCall(service.store(newRole.value));

  if (error === null) {
    toast.add({
      severity: 'success',
      detail: t('modules.roles.created'),
      life: 10000
    });
    return true;
  }

  switch (error.statusCode) {
    case 403:
      toast.add(getGeneric403Message());
      return false;
    default:
      toast.add(
        getGenericErrorMessage(
          `Error ${error.statusCode} -> ${error.statusMessage}`
        )
      );
      return false;
  }
}
</script>

<template>
  <section class="container">
    <h1>{{ $t('modules.roles.create') }}</h1>
    <RoleFormContainer v-model="newRole" :submit-handler="submitHandler" />
  </section>
</template>

<style scoped></style>
