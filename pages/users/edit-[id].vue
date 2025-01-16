<script setup lang="ts">
import { createError, definePageMeta, useI18n, useRoute } from '#imports';
import { UserService } from '~/services/user-service';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import type { UpdateUser } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard']
});

const { t } = useI18n();
const route = useRoute();

const userService = new UserService();

const { data, error } = await userService.findById(Number(route.params.id));

if (error || data === null) {
  throw createError({
    statusCode: 404,
    statusMessage: t('error.404.specific.user'),
    fatal: true
  });
}

async function submitHandler(payload: UpdateUser) {
  return userService.update(Number(route.params.id), payload);
}
</script>

<template>
  <UserFormContainer
    mode="update"
    :initial-data="data"
    :submit-handler="submitHandler"
  />
</template>

<style scoped></style>
