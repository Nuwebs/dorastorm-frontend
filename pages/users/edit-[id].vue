<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { definePageMeta, useRoute } from '#imports';
import { UserService } from '~/services/user-service';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import type { UpdateUser, User } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard']
});

const route = useRoute();
const loading = ref<boolean>(false);
const user = ref<User | null>(null);

const userService = new UserService();

async function submitHandler(payload: UpdateUser) {
  return userService.update(Number(route.params.id), payload);
}

onMounted(async () => {
  loading.value = true;
  const { data, error } = await userService.findById(Number(route.params.id));
  loading.value = false;

  if (error) return;

  user.value = data;
});
</script>

<template>
  <p v-if="loading">Cargando...</p>
  <div v-else-if="!loading && !user">404</div>
  <UserFormContainer
    v-else
    mode="update"
    :initial-data="user!"
    :submit-handler="submitHandler"
  />
</template>

<style scoped></style>
