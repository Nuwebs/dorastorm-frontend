<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('forms.forgot_password') }}
        </template>
        <template #content>
          <form @submit="submit">
            <FormText v-model="data.email" name="email" type="email" :label="$t('forms.email')" />
            <Button type="submit" class="w-full justify-content-center" :loading="isSubmitting">
              {{ $t('forms.submit')
              }}
            </Button>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { definePageMeta, useI18n, useSubmitHandler } from '#imports';
import FormText from '~/components/form/FormText.vue';

definePageMeta({
  middleware: ['guest-guard']
});

const data = ref({
  email: ''
});
const toast = useToast();
const { t } = useI18n();

const validate = object({
  email: string().required().email().label(t('forms.email'))
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: validate
});

const submit = handleSubmit(async () => await useSubmitHandler(
  {
    endpoint: 'forgot-password',
    auth: false,
    options: {
      method: 'post',
      body: data.value
    }
  },
  () => {
    toast.add({
      severity: 'success',
      detail: t('modules.users.fp_email_send'),
      life: 3000
    });
  },
  (error) => {
    if (error.statusCode === 422) {
      return setFieldError('email', t('error.validation.email_404'));
    }
    setFieldError('password', t('error.fatal'));
  }
));
</script>
