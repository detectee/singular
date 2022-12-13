import { Ref } from 'vue'
import { defineStore } from 'pinia'
//import { useLocalStorage } from '@vueuse/core'

export interface DetecteeSettings {
  apiUrl: string
  [key: string]: any
}

export const useDetecteeSettings = defineStore('detecteeSettings', () => {
  const DETECTEE_SETTINGS = 'DETECTEE_SETTINGS'

  let readyPromise: Promise<void> | null = null
  let localStorage: any = null

  const settings: Ref<DetecteeSettings> = ref({
    apiUrl: '',
  })

  function saveSettings() {
    localStorage?.setItem(DETECTEE_SETTINGS, JSON.stringify(settings.value))
    ready()
  }

  onBeforeMount(() => {
    localStorage = window.localStorage
    const local_data =  localStorage?.getItem(DETECTEE_SETTINGS)
    if (local_data) {
      settings.value = JSON.parse(local_data)
    }
  })

  async function ready() {
    if (!readyPromise) {
      readyPromise = new Promise(async function(resolve, reject) {
        try {
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    }
    return readyPromise
  }

  return {
    settings,
    saveSettings,
    ready,
  }
})
