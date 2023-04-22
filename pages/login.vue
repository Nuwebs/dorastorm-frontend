<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>Sign in</template>
        <template #content>
          <Form @submit="submit" :validation-schema="validations">
            <FormText name="email" label="Email:" type="email" placeholder="example@example.com" icon="pi pi-at"
              v-model="credentials.email" />
            <FormText name="password" label="Password:" type="password" icon="pi pi-lock"
              v-model="credentials.password" />
            <Button type="submit" class="w-full justify-content-center mb-2" :loading="loading">Submit</Button>
            <Hr />
          </Form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, navigateTo } from '#imports';
import { login } from '~/services/auth';
import { DsLoginCredentials } from '~/types/dorastorm';
import Card from "primevue/card";
import Button from "primevue/button";
import Hr from '~/components/Hr.vue';
import FormText from '~/components/form/FormText.vue';
import { Form } from "vee-validate";
import { object, string } from "yup";

definePageMeta({
  middleware: ['guest-guard']
});

const credentials = ref<DsLoginCredentials>({
  email: '',
  password: ''
});

const validations = object({
  email: string().required().email(),
  password: string().required()
});

const loading = ref<boolean>(false);

async function submit(): Promise<void> {
  loading.value = true;
  const response = await login(credentials.value);
  if (response) {
    loading.value = false;
    console.log(response.data);
    return;
  }
  navigateTo('/ds');
}
</script>