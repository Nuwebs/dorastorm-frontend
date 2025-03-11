<script setup lang="ts">
import type { FetchError } from 'ofetch/node';
import { createError, definePageMeta, useI18n } from '#imports';
import FormText from '~/components/form/FormText.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import { useToast } from '~/components/ui/toast';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { useUserForm } from '~/composables/useUserForm';
import useAuthStore from '~/stores/auth-store';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { ChangeUserPassword } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard']
});

const { t } = useI18n();
const { toast } = useToast();
const { getGenericErrorMessage, getGeneric403Message, getGeneric404Message } =
  useGenericToastMessages();
const { user } = useAuthStore();

if (!user) {
  throw createError({
    statusCode: 403,
    statusMessage: t('error.403.default_message'),
    fatal: true
  });
}

const {
  password,
  password_confirmation,
  current_password,

  isSubmitting,
  resetForm,
  setFieldError,
  onSubmit
} = useUserForm('change-password', user);

async function handleSubmit() {
  const submitResult = await onSubmit();
  if (submitResult === undefined) return;

  if (submitResult.error === null) {
    resetForm();
    return toast({
      variant: 'success',
      description: t('modules.users.password_changed')
    });
  }

  if (submitResult.error) {
    const error = submitResult.error as FetchError<
      LaravelValidationErrorBag<ChangeUserPassword>
    >;

    switch (error.statusCode) {
      case 403:
        return toast(getGeneric403Message());
      case 404:
        return toast(getGeneric404Message());
      case 422:
        if (!error.data) return toast(getGenericErrorMessage());
        for (const [key, value] of Object.entries(error.data!.errors)) {
          setFieldError(key as keyof ChangeUserPassword, value);
        }
        return;
      default:
        return toast(getGenericErrorMessage());
    }
  }
}
</script>

<template>
  <form class="container" @submit.prevent="handleSubmit">
    <h1>{{ $t('modules.users.change_password') }}</h1>
    <FormText
      v-model="current_password"
      name="current_password"
      :label="$t('forms.current_password')"
      type="password"
    />
    <FormText
      v-model="password"
      name="password"
      :label="$t('forms.password')"
      type="password"
    />
    <FormText
      v-model="password_confirmation"
      name="password_confirmation"
      :label="$t('forms.confirm_password')"
      type="password"
    />
    <UiButton type="submit" :loading="isSubmitting" class="mt-3">
      {{ $t('modules.users.change_password') }}
    </UiButton>
  </form>
</template>

<style scoped></style>
