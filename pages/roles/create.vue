<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useI18n } from '#imports';
import RoleFormContainer from '~/components/role/form/RoleFormContainer.vue';
import { useToast } from '~/components/ui/toast';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { PERMISSION } from '~/services/permission-service';
import { RoleService } from '~/services/role-service';
import type { NewRole } from '~/types/role';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_CREATE]
});

const { toast } = useToast();
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
    toast({
      variant: 'success',
      description: t('modules.roles.created')
    });
    return true;
  }

  switch (error.statusCode) {
    case 403:
      toast(getGeneric403Message());
      return false;
    default:
      toast(
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
