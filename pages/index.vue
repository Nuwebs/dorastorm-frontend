<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { object, string } from 'zod';
import { definePageMeta, navigateTo, useLocalePath } from '#imports';
import FormText from '~/components/form/FormText.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import { UiCard, UiCardTitle, UiCardContent } from '~/components/ui/card';
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
    <UiCard class="w-2/3 md:w-1/3">
      <UiCardTitle>
        {{ $t('general.login') }}
      </UiCardTitle>
      <UiCardContent>
        <form @submit="submit">
          <!-- <FormText
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
          /> -->
          <UiButton type="submit" :loading="isSubmitting" class="w-full">
            {{ $t('forms.submit') }}
          </UiButton>
        </form>
      </UiCardContent>
    </UiCard>
  </section>
</template>

<style scoped></style>
