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
import useCachedPermissions from '~/composables/useCachedPermissions';
import { PERMISSION } from '~/services/permission-service';
import { UserService } from '~/services/user-service';
import useAuthStore from '~/stores/auth-store';
import type { User } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard']
});

const { t } = useI18n();
const route = useRoute();
const { toast } = useToast();
const authStore = useAuthStore();
const { userCan } = useCachedPermissions([PERMISSION.USERS_UPDATE]);

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
      :mode="userCan(PERMISSION.USERS_UPDATE) ? 'admin-update' : 'self-update'"
      :initial-data="data!"
      @success="(payload) => handleSuccess(payload as User)"
    />
  </section>
</template>

<style scoped></style>
