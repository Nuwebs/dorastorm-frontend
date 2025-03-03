<script setup lang="ts">
import {
  createError,
  definePageMeta,
  useAsyncData,
  useI18n,
  useRoute
} from '#imports';
import RoleFormContainer from '~/components/role/form/RoleFormContainer.vue';
import { useToast } from '~/components/ui/toast';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { PERMISSION } from '~/services/permission-service';
import { RoleService } from '~/services/role-service';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_UPDATE]
});

const { t } = useI18n();
const route = useRoute();
const { toast } = useToast();
const { getGeneric403Message, getGenericErrorMessage } =
  useGenericToastMessages();

const service = new RoleService();

const { data, error } = await useAsyncData(() =>
  service.findById(Number(route.params.id))
);

if (error.value || data.value === null) {
  throw createError({
    statusCode: 404,
    statusMessage: t('error.404.specific.role'),
    fatal: true
  });
}

async function submitHandler(): Promise<boolean> {
  const { error } = await service.handledCall(
    service.updateById(data.value!.id, data.value!)
  );

  if (error === null) {
    toast({
      variant: 'success',
      description: t('general.updated')
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
    <RoleFormContainer
      v-model="data!"
      updating
      :submit-handler="submitHandler"
    />
  </section>
</template>

<style scoped></style>
