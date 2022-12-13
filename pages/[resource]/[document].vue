<template>
<div class="col-12 lg:col-6 lg:col-offset-3">
  <div class="card">
    <div class="mb-3">
      <ul class="list-none p-0 m-0 flex align-items-center gap-2">
        <Button class="p-button-outlined" @click="onClose()">
          <i class="pi pi-chevron-left"></i>
        </Button>
        <Button class="p-button-success p-button-outlined" @click="onSave()">
          <i class="pi pi-chevron-left"></i>
          <i class="pi pi-save"></i>
        </Button>
        <Button class="p-button-danger p-button-outlined" @click="onDelete()">
          <i class="pi pi-times"></i>
        </Button>
      </ul>
    </div>
    <div v-for="col of meta.columns" :field="col.name" :header="col.name" :key="col.name" class="field grid">
      <label :for="'fld_'+col.name" class="col-12 mb-2 md:col-2 md:mb-0">{{col.name}}</label>
      <div class="col-12 md:col-10">
        <input v-model="record[col.name]" :id="'fld_'+col.name" type="text" :disabled="false"
          class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { nullResource, Resource } from '~~/composables/JsonApi'

const route = useRoute()

const informationSchema = useInformationSchemaRepository()
const singleDocument = useSingleDocumentRepository()


const resource: string = Array.isArray(route.params.resource) ? route.params.resource[0] : route.params.resource
const resourceId: string = Array.isArray(route.params.document) ? route.params.document[0] : route.params.document
const meta: Ref<any> = ref({})
const record: Ref<Resource>  = ref(nullResource())

informationSchema.ready().then(() => {
  meta.value = informationSchema.find({ type: 'tables', id: resource})
  if (resourceId === 'new') {
    record.value = informationSchema.create(resource, '')
  } else {
    singleDocument.fetchOne(resource, resourceId).then(() => {
      record.value = singleDocument.getOne(resource, resourceId)[0]
    })
  }
})

function onClose() {
  const router = useRouter()
  router.back()
}

function onSave() {
  const res: Resource = toRaw(record.value)
  singleDocument.persist(res).then(() => onClose())
}

function onDelete() {
  const res: Resource = toRaw(record.value)
  singleDocument.remove(res).then(() => onClose())
}
</script>
