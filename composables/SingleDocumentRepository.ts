import { defineStore } from 'pinia'
import { useDetecteeSettings } from './DetecteeSettings'
import { FindOptions, JsonApiValues, Resource, JsonApiIdentifier } from './JsonApi'
import { SingleDocument } from './SingleDocument'

export const useSingleDocumentRepository = defineStore('SingleDocumentRepository', () => {
  const detecteeSettings = useDetecteeSettings()

  const store = new SingleDocument(detecteeSettings.settings.apiUrl)

  async function fetch(type: string, options?: FindOptions): Promise<Resource[]> {
    store.setRequestOptions(detecteeSettings.settings.apiUrl)
    return store.fetch(type, options)
  }

  async function fetchOne(type: string, id: string): Promise<Resource[]> {
    store.setRequestOptions(detecteeSettings.settings.apiUrl)
    return store.fetchOne(type, id)
  }

  async function persist(resource: Resource): Promise<void> {
    return store.persist(resource)
  }

  async function remove(resource: JsonApiIdentifier): Promise<void> {
    return store.delete(resource)
  }

  function getMeta():JsonApiValues {
    return store.getMeta()
  }

  function getAll(type: string): Resource[] {
    return store.getAll(type)
  }

  function getOne(type: string, id: string): Resource[] {
    return store.getOne(type, id)
  }

  return {
    fetch,
    fetchOne,
    persist,
    remove,
    getMeta,
    getAll,
    getOne,
  }
})
