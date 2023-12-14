<template>
  <div class="grid grig-nogutter">
    <div class="col-12 md:col-8">
      <strong>{{ $t("forms.email") }}</strong> {{ props.quotation.email }}
    </div>
    <div class="col-12 md:col-4">
      <strong>{{ $t("modules.quotations.phone") }}</strong> {{ props.quotation.phone }}
    </div>
    <div class="col-12">
      <strong>{{ $t("general.message") }}:</strong>
      <p>
        {{ props.quotation.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Quotation } from '~/types/dorastorm';

interface Props {
  quotation: Quotation
}

const props = defineProps<Props>();
</script>
