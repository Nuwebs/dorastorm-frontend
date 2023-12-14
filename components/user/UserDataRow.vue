<template>
  <div class="grid grid-nogutter">
    <div class="col-12 md:col-3 md:max-h-10rem flex md:justify-content-center">
      <div class="p-1 border-1 surface-border border-round">
        <img
          src="~/assets/imgs/default-user.svg"
          alt="Profile picture"
          class="max-w-full max-h-10rem md:max-h-full profile-img-colors"
        />
      </div>
    </div>
    <div class="col-12 md:col-9 md:pl-1 xl:pl-0">
      <strong>{{ props.user.name }}</strong>
      <p>
        <strong>{{ $t('forms.email') }}</strong> {{ props.user.email }} <br />
        <strong>{{ $t('modules.users.role') }}</strong>
        {{ props.user.role.name }} <br />
        <strong>{{ $t('general.member_since') }}</strong> {{ fromNow() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useRelativeTime from '~/composables/useRelativeTime';
import { User } from '~/types/dorastorm';

interface Props {
  user: User;
}

const props = defineProps<Props>();
const { fromNow } = useRelativeTime(props.user.created_at);
</script>
<style scoped>
.profile-img-colors {
  filter: invert(77%) sepia(9%) saturate(112%) hue-rotate(122deg)
    brightness(96%) contrast(90%);
}
</style>
