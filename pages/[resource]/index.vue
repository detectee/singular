<template>
<div class="col-12">
  <DataTable class="p-datatable-sm"
    :value="records" :resizableColumns="false" column-resize-mode="fit"  responsive-layout="scroll"
    :lazy="true" :totalRecords="totalRecords" :loading="loading" :scrollable="true"
    :paginator="true" :rows="10" :rowsPerPageOptions="[10,20,50]" @page="onPage($event)" ref="dt"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    @sort="onSort($event)"
    v-model:filters="filters" filterDisplay="menu" :globalFilterFields="globalFilterFields" @filter="onFilter($event)"
    rowdblclick="onRowClick($event)"
    stateStorage="session" stateKey="dt-state-demo-session" @state-restore="onPage($event)"
  >
    <template #empty>
      No data found.
    </template>
    <template #loading>
      Loading data. Please wait.
    </template>
    <template #header>
      <div class="flex flex-row justify-content-between align-items-center">
        <span class="m-0">
          <span class="text-2xl font-bold mr-3">{{ resource }}</span>
          <span>
            <Button icon="pi pi-plus" class="p-button-success p-button-outlined" @click="createProduct()"/>
          </span>
        </span>
        <span class="p-input-icon-left ">
          <i class="pi pi-search" />
          <InputText v-model="globalFilter.value" placeholder="Keyword Search" @keydown.enter="onFilter($event)" />
        </span>
      </div>
    </template>
    <Column :exportable="false" frozen style="max-width:3rem;">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-sm p-button-success p-button-text" @click="editProduct(slotProps.data)" />
      </template>
    </Column>
    <Column v-for="col of columns" :field="col.name" :header="col.name" :key="col.name" :style="{width:'150px'}" :sortable="true">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search - ${filterModel.matchMode}`"/>
      </template>
    </Column>
  </DataTable>
  <div>
    <pre>lazyPrms:{{ lazyPrms }}</pre>
    <pre>globalFilterFields:{{ globalFilterFields }}</pre>
    <pre>globalFilter:{{ globalFilter }}</pre>
    <pre v-pre>filters:{{ filters }}</pre>
    <pre>TR:{{ totalRecords }} RpP:{{ rowsPerPage }}</pre>
  </div>
</div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import {FilterMatchMode, FilterOperator} from 'primevue/api'
import { useSingleDocumentRepository } from '~~/composables/SingleDocumentRepository'
import { FindOptions, Resource } from '~~/composables/JsonApi';

const route = useRoute()
const informationSchema = useInformationSchemaRepository()
const singleDocumentRepository = useSingleDocumentRepository()

const dt = ref()
const resource: string = Array.isArray(route.params.resource) ? route.params.resource[0] : route.params.resource

useHead({
  title: `${resource} - Detectee`,
})

const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const lazyPrms: Ref<FindOptions> = ref({
  filter: '',
})
const filters: Ref<any> = ref({})

const globalFilterFields = ref(['head'])
const globalFilter = ref({
  value: null,
  matchMode: FilterMatchMode.CONTAINS,
})

const records: Ref<Resource[]> = ref([
  // {"brand": "Volkswagen", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
  // {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
  // {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
  // {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
  // {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
  // {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
  // {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
  // {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
  // {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
  // {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"},
])

const columns: Ref<any> = ref([
  // { name: 'brand', field_name: 'Brand', id: 1 },
  // { name: 'year', field_name: 'Year', id: 2 },
  // { name: 'color', field_name: 'Color', id: 3 },
  // { name: 'vin', field_name: 'VIN', id: 4 },
])

function loadLazyData(options: FindOptions = {}) {
  loading.value = true;
  lazyPrms.value = { ...lazyPrms.value, ...options }
  singleDocumentRepository.fetch(resource, lazyPrms.value).then(() => {
    records.value = singleDocumentRepository.getAll(resource)
    totalRecords.value = singleDocumentRepository.getMeta().total
    loading.value = false
  }).catch((err) => {
    console.log(err)
    loading.value = false
  })
}

const onPage = (event: any) => {
  loadLazyData({
    pageOffset: event.first,
    pageLimit: event.rows,
  });
}

const onSort = (event: any) => {
  loadLazyData({
    sort: (event.sortOrder < 0 ? '-' : '') + event.sortField,
  })
}

const onFilter = (event: any) => {
  const data = globalFilter.value.value == '' ? '' : `contains(head,'${globalFilter.value.value}')`
  loadLazyData({
    filter: data,
    //'filterGlobal': globalFilter.value,
  });
}

const editProduct = (data: any) => {
  navigateTo(`/${resource}/${data.id}`)
}

const createProduct = () => {
  navigateTo(`/${resource}/new`)
}

const confirmDeleteProduct = (data: any) => {
  navigateTo(`/${resource}/${data.id}`)
}

const onRowClick = (event: any) => {
  navigateTo(`/${resource}/${event.data.id}`)
}

informationSchema.ready().then(() => {
  columns.value = informationSchema.find({ type: 'tables', id: resource})?.columns
  columns.value.forEach((item: any) => {
    filters.value[item.name] = {
      value: '',
      matchMode: 'contains',
    }
  })
  loadLazyData()
})

</script>
