<script setup lang="ts">
import { createError, useAsyncData } from '#app';
import FormSelect from '~/components/form/FormSelect.vue';
import { UserService } from '~/services/user-service';

const service = new UserService();
const { data: roles, error } = useAsyncData(() => service.getRolesBelow());

if (error.value) {
  throw createError({ statusCode: 403 });
}
</script>

<template>
  <FormSelect
    name="role_id"
    :label="$t('modules.users.role')"
    :options="roles!"
    option-value="id"
    option-label="name"
    filter
  />
</template>

<style scoped></style>
