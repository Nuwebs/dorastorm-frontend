<template>
    <DefaultLayout>
      <NuxtPage></NuxtPage>
    </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from "~/layouts/default.vue";
import {login} from "~/services/auth";
import { ErrorBag } from "./types";
import { DsErrorBag } from "./types/dorastorm";

if (process.client) {
  const result = await login({email: 'contacto@nuwebs.com.co', password: 'password'});
  if (result) {
    let a = result as ErrorBag<DsErrorBag>;
    console.log(a.data?.errors);
  }
}
</script>
