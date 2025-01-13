<script setup lang="ts">
import { definePageMeta, navigateTo, useLocalePath } from '#imports';
import { toTypedSchema } from '@vee-validate/zod';
import { Card, Button } from 'primevue';
import { useForm } from 'vee-validate';
import { object, string } from 'zod';
import FormText from '~/components/form/FormText.vue';
import useAuthStore from '~/stores/auth-store';

definePageMeta({
  middleware: ['guest-guard']
});

const authStore = useAuthStore();
const lp = useLocalePath();

const validations = toTypedSchema(
  object({
    email: string().email().min(1),
    password: string().min(1)
  })
);

const { isSubmitting, handleSubmit, setFieldError } = useForm({
  validationSchema: validations
});

const submit = handleSubmit(async (payload) => {
  const logged = await authStore.login(payload);
  if (!logged) {
    setFieldError('email', 'Error'); // Todo: change
  }

  navigateTo(lp('/home'));
});
</script>

<template>
  <section class="flex justify-center py-8">
    <Card class="w-2/3 md:w-1/3">
      <template #title>{{ $t('general.login') }}</template>
      <template #content>
        <form @submit="submit">
          <FormText
            name="email"
            :label="$t('forms.email')"
            type="email"
            class="mb-4"
          />
          <FormText
            name="password"
            :label="$t('forms.password')"
            type="password"
            class="mb-4"
          />
          <Button
            :loading="isSubmitting"
            :label="$t('forms.submit')"
            class="w-full"
            type="submit"
          />
        </form>
      </template>
    </Card>
  </section>
</template>

<style scoped></style>
