import { defineStore } from 'pinia'
import { useDetecteeSettings } from './DetecteeSettings'
import { JsonApiStore, Resource, JsonApiIdentifier, fetchJsonApi } from './JsonApi'
import { BaseResource } from './JsonApi/BaseResource'

export const useInformationSchemaRepository = defineStore('informationSchemaRepository', () => {
  const detecteeSettings = useDetecteeSettings()
  let initPromise: any = null

  const store = new JsonApiStore()

  function find(identifier: JsonApiIdentifier): Resource | null {
    return store.getOne(identifier)
  }

  function findAll(type: string): Resource[] {
    return store.getAll(type)
  }

  function create(type: string, id: string): Resource {
    const meta: Resource = store.getOne({ type: 'tables', id: type})
    const emptyResource: any = {}
    meta.columns.forEach((col: any) => {
      emptyResource[col.name] = null
    })
    emptyResource.type = type
    emptyResource.id = id
    return new BaseResource(emptyResource)
  }

  async function reset() {
    initPromise = new Promise(async function(resolve, reject) {
      try {
        await detecteeSettings.ready()
        const server_data = await fetchJsonApi(`${detecteeSettings.settings.apiUrl}/information_schema/tables`)
        store.sync(server_data)
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
    return initPromise
  }

  async function ready() {
    if (!initPromise) {
      return reset()
    }
    return initPromise
  }

  return {
    find,
    findAll,
    ready,
    reset,
    create,
  }
})
