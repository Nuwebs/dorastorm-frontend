<script setup lang="ts">
import { definePageMeta, useI18n, useToast } from '#imports';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import { PERMISSION } from '~/services/permission-service';
import { UserService } from '~/services/user-service';
import type { NewUserFromAdmin } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.USERS_CREATE]
});

const toast = useToast();
const { t } = useI18n();
const uS = new UserService();

function handleSuccess(): void {
  toast.add({
    severity: 'success',
    detail: t('modules.users.created')
  });
}

function submitHandler(payload: NewUserFromAdmin) {
  return uS.store(payload);
}
</script>

<template>
  <section class="container">
    <h1>{{ $t('modules.users.create') }}</h1>
    <UserFormContainer
      mode="admin"
      :submit-handler="submitHandler"
      @success="handleSuccess"
    />
  </section>
</template>

<style scoped></style>
