<script setup lang="ts">
import { definePageMeta, useToast } from '#imports';
import UserFormContainer from '~/components/user/form/UserFormContainer.vue';
import { UserService } from '~/services/user-service';

definePageMeta({
  middleware: ['auth-guard']
});

const toast = useToast();
const uS = new UserService();

function handleSuccess(): void {
  toast.add({
    detail: 'funca'
  });
}
</script>

<template>
  <UserFormContainer
    mode="admin"
    :submit-handler="uS.create"
    @success="handleSuccess"
  />
</template>

<style scoped></style>
