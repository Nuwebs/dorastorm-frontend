<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Button } from 'primevue';
import { useForm } from 'vee-validate';
import { object, string } from 'zod';
import { definePageMeta, useI18n, useToast } from '#imports';
import FormText from '~/components/form/FormText.vue';
import UserFormPassword from '~/components/user/form/UserFormPassword.vue';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { UserService } from '~/services/user-service';
import useAuthStore from '~/stores/auth-store';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { ChangeUserPassword } from '~/types/user';
import { PASSWORDS_FIELDS } from '~/utils/schemas/user';

definePageMeta({
  middleware: ['auth-guard']
});

const { t } = useI18n();
const toast = useToast();
const userService = new UserService();
const { getGenericErrorMessage, getGeneric403Message, getGeneric404Message } =
  useGenericToastMessages();
const { user } = useAuthStore();

const validatonSchema = toTypedSchema(
  object({
    ...PASSWORDS_FIELDS,
    current_password: string()
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('error.validation.confirm_password'),
    path: ['password_confirmation']
  })
);

const { isSubmitting, handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: validatonSchema
});

const submit = handleSubmit(async (payload) => {
  if (!user) return;
  const { error } = await userService.handledCall<
    LaravelValidationErrorBag<ChangeUserPassword>
  >(userService.changePasswordById(user.id, payload));

  if (error === null) {
    resetForm();
    return toast.add({
      severity: 'success',
      detail: t('modules.users.password_changed'),
      life: 10000
    });
  }

  switch (error.statusCode) {
    case 403:
      return toast.add(getGeneric403Message());
    case 404:
      return toast.add(getGeneric404Message());
    case 422:
      if (!error.data) return toast.add(getGenericErrorMessage());
      for (const [key, value] of Object.entries(error.data!.errors)) {
        setFieldError(key as keyof ChangeUserPassword, value);
      }
      return;
    default:
      return toast.add(getGenericErrorMessage());
  }
});
</script>

<template>
  <form class="container" @submit="submit">
    <h1>{{ $t('modules.users.change_password') }}</h1>
    <FormText
      name="current_password"
      :label="$t('forms.current_password')"
      type="password"
    />
    <UserFormPassword />
    <Button
      type="submit"
      :loading="isSubmitting"
      :label="$t('modules.users.change_password')"
      class="mt-3"
    />
  </form>
</template>

<style scoped></style>
