<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>Sign in</template>
        <template #content>
          <form @submit.prevent="submit">
            <div class="p-inputgroup flex-1 mb-2">
              <span class="p-inputgroup-addon"><i class="pi pi-at"></i></span>
              <InputText name="email" v-model="credentials.email" type="email" required placeholder="example@example.com"/>
            </div>
            <div class="p-inputgroup flex-1 mb-2">
              <span class="p-inputgroup-addon"><i class="pi pi-lock"></i></span>
              <InputText v-model="credentials.password" type="password" required placeholder="password"/>
            </div>
            <Button type="submit">Submit</Button>
          </form>
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
import InputText from "primevue/inputtext";
import Button from "primevue/button";

definePageMeta({
  middleware: ['guest-guard']
});

const credentials = ref<DsLoginCredentials>({
  email: '',
  password: ''
});

async function submit(): Promise<void> {
  const response = await login(credentials.value);
  if (response) {
    console.log(response.data);
    return;
  }
  navigateTo('/ds');
}

</script>