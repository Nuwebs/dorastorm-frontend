<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormSelect from '~/components/form/FormSelect.vue';
import { UserService } from '~/services/user-service';
import type { Role } from '~/types/role';

const loading = ref<boolean>(false);
const roles = ref<Role[]>([]);

onMounted(async () => {
  loading.value = true;
  const { data, error } = await new UserService().getRolesBelow();
  if (error) {
    return;
  }
  loading.value = false;

  roles.value = data!;
});
</script>

<template>
  <FormSelect
    name="role_id"
    :label="$t('modules.users.role')"
    :options="roles"
    option-value="id"
    option-label="name"
    filter
  />
</template>

<style scoped></style>
