<template>
<div class="col-12 lg:col-6 lg:col-offset-3">
  <div class="card">
    <div class="mb-3">
      <ul class="list-none p-0 m-0 flex align-items-center gap-2">
        <Button class="p-button-success p-button-outlined" @click="onSave()">
          <i class="pi pi-save"></i>
        </Button>
      </ul>
    </div>
    <div v-for="view of settingsView" :key="view.name" class="field grid">
      <label :for="'fld_'+view.name" class="col-12 mb-2 md:col-2 md:mb-0">{{view.title}}</label>
      <div class="col-12 md:col-10">
        <input v-model="settings[view.name]" :id="'fld_'+view.name" type="text" :disabled="false"
          class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const detecteeSetings = useDetecteeSettings()
const { settings }  = storeToRefs(detecteeSetings)

const settingsView = [
  { name: 'apiUrl', title: 'api url', },
]

useHead({
  title: `Detectee Settings`,
})

function onSave() {
  detecteeSetings.saveSettings()
  const infoSchema = useInformationSchemaRepository()
  infoSchema.reset()
}

</script>
