<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useI18n, useToast } from '#imports';
import { PERMISSION } from '~/services/permission-service';
import type { NewRole } from '~/types/role';
import { RoleService } from '~/services/role-service';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import RoleFormContainer from '~/components/role/form/RoleFormContainer.vue';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_CREATE]
});

const toast = useToast();
const { getGeneric403Message, getGenericErrorMessage } =
  useGenericToastMessages();
const { t } = useI18n();
const newRole = ref<NewRole>({
  name: '',
  description: '',
  hierarchy: -1,
  permissions: []
});

async function submitHandler(): Promise<boolean> {
  const { error } = await new RoleService().create(newRole.value);

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
  <div>
    <h1>{{ $t('modules.roles.create') }}</h1>
    <RoleFormContainer v-model="newRole" :submit-handler="submitHandler" />
  </div>
</template>

<style scoped></style>
