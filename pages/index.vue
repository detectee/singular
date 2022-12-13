<template>
  <div class="card col-12 lg:col-6 lg:col-offset-3">
    <ul class="list-none">
      <li v-for="tab in tableList" :key="tab.id" class="text-xl mb-2 ">
        <NuxtLink :to="`/${tab.name}`">{{ tab.name }}</NuxtLink>
      </li>
    </ul>
    <pre></pre>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { Resource } from '~~/composables/JsonApi'
import { useInformationSchemaRepository } from '~~/composables/InformationSchemaRepository';

const informationSchema = useInformationSchemaRepository()

const tableList: Ref<Resource[]> = ref([])

useHead({
  title: 'Detectee',
})


informationSchema.ready().then(() => {
  tableList.value = informationSchema.findAll('tables')
})

</script>

<style scoped>
</style>
