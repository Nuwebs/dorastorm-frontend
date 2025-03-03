<script setup lang="ts">
import {
  createError,
  definePageMeta,
  useAsyncData,
  useI18n,
  useRoute
} from '#imports';
import { useToast } from '~/components/ui/toast';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import { UserService } from '~/services/user-service';
import useAuthStore from '~/stores/auth-store';
import type { UpdateUser, User } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard']
});

const { t } = useI18n();
const route = useRoute();
const { toast } = useToast();
const authStore = useAuthStore();

const userService = new UserService();

const { data, error } = await useAsyncData(() =>
  userService.findById(Number(route.params.id))
);

if (error.value || data.value === null) {
  throw createError({
    statusCode: 404,
    statusMessage: t('error.404.specific.user'),
    fatal: true
  });
}

async function submitHandler(payload: UpdateUser) {
  return userService.updateById(Number(route.params.id), payload);
}

function handleSuccess(user: User): void {
  if (user.id === authStore.user?.id) {
    authStore.user = user;
  }
  toast({
    variant: 'success',
    description: t('general.updated')
  });
}
</script>

<template>
  <section class="container">
    <h1>{{ $t('modules.users.update') }}</h1>
    <UserFormContainer
      mode="update"
      :initial-data="data!"
      :submit-handler="submitHandler"
      @success="(payload) => handleSuccess(payload as User)"
    />
  </section>
</template>

<style scoped></style>
