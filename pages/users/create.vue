<script setup lang="ts">
import { definePageMeta, useI18n } from '#imports';
import { useToast } from '~/components/ui/toast';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import { PERMISSION } from '~/services/permission-service';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.USERS_CREATE]
});

const { toast } = useToast();
const { t } = useI18n();

function handleSuccess(): void {
  toast({
    variant: 'success',
    description: t('modules.users.created')
  });
}
</script>

<template>
  <section class="container">
    <h1>{{ $t('modules.users.create') }}</h1>
    <UserFormContainer mode="admin-create" @success="handleSuccess" />
  </section>
</template>

<style scoped></style>
