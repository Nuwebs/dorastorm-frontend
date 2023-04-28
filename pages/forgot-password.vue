<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('forms.forgot_password') }}
        </template>
        <template #content>
          <form @submit="onSubmit">
            <FormText name="email" type="email" :label="$t('forms.email')" v-model="data.email" />
            <Button type="submit" class="w-full justify-content-center" :loading="isSubmitting">{{ $t('forms.submit')
            }}</Button>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import { ref } from "vue";
import FormText from "~/components/form/FormText.vue";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import Button from "primevue/button";
import useAPIOptions from "~/composables/useAPIOptions";
import { definePageMeta } from "#imports";
import { useToast } from "primevue/usetoast";

definePageMeta({
  middleware: ['guest-guard']
});

const data = ref({
  email: ''
});
const toast = useToast();

const validate = object({
  email: string().required().email()
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: validate
});

// Replace fetch with useFetch implementation when useFetch type bug is fixed
const onSubmit = handleSubmit(async () => {
  try {
    await $fetch<void>('/forgot-password', {
      ...useAPIOptions(),
      method: 'post',
      body: data.value
    });
    toast.add({ severity: 'success', summary: 'Email send', detail: 'Check your email for the next steps.', life: 3000 })
  } catch (error: any) {
    if (error.statusCode === 422) {
      setFieldError('email', 'The email you provided does not exists in our database');
    }
  }
});
</script>