<template>
  <section>
    <h1>Home page for logged users</h1>
    <DataTableBase :data="data" :global-filter-fields="['nombre', 'apellido']" v-model:filters="filters" expandable
      lazy-paginator @filter="test">
      <template #globalFilter>
        <input type="text" v-model="filters.global.value">
      </template>
      <Column field="nombre" header="Nombre" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <input type="text" class="p-column-filter" v-model="filterModel.value" @keydown.enter="filterCallback()">
        </template>
      </Column>
      <Column field="apellido" header="Apellido" sortable />
      <template #expansion="test: any">
        <h1>{{ test.data.nombre }}</h1>
      </template>
    </DataTableBase>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import { FilterMatchMode } from 'primevue/api';
import { ref } from "vue";
import Column from "primevue/column";
import DataTableBase from '~/components/dataTable/DataTableBase.vue';

// This page shouldn't have any permission due to be the base logged in
// users page.
definePageMeta({
  middleware: ['auth-guard']
});

const data = ref([
  {
    nombre: "Douglas",
    apellido: "Ramírez"
  },
  {
    nombre: "Zemprom",
    apellido: "Andrés"
  }
]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const columns = [
  {
    fieldName: "nombre",
    header: "Nombre",
    sortable: true
  },
  {
    fieldName: "apellido",
    header: "Apellido",
    sortable: true
  }
];

function test(param: any) {
  console.log(param);
}
</script>