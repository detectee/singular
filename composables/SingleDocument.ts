import { Resource, FindOptions, JsonApiValues, JsonApiStore, JsonApiRequest, JsonApiIdentifier } from "./JsonApi"

/**
 * One JSONAPI Document store
 *
 */
export class SingleDocument {
  #requestOptions: string = '/'
  #store: JsonApiStore
  #meta: JsonApiValues = {}

  constructor(public apiUri: string) {
    this.#store = new JsonApiStore()
    this.#requestOptions = apiUri
  }

  setRequestOptions(options: string) {
    this.#requestOptions = options
  }

  getOne(type: string, id: string): Resource[] {
    return [this.#store.getOne({type, id})]
  }

  getAll(type: string): Resource[] {
    return this.#store.getAll(type)
  }

  getMeta(): JsonApiValues {
    return this.#meta
  }

  async fetchOne(type: string, id: string): Promise<Resource[]> {
    const server_data = await (new JsonApiRequest(this.#requestOptions)).queryOne(type, id)
    this.#meta = server_data?.meta
    this.#store.reset()
    return this.#store.sync(server_data)
  }

  async fetch(type: string, options?: FindOptions): Promise<Resource[]> {
    const server_data = await (new JsonApiRequest(this.#requestOptions)).queryAll(type, options)
    this.#meta = server_data?.meta
    this.#store.reset()
    return this.#store.sync(server_data)
  }

  async persist(resource: Resource): Promise<void> {
    if (resource.id) {
      return (new JsonApiRequest(this.#requestOptions)).update(resource)
    } else {
      return (new JsonApiRequest(this.#requestOptions)).create(resource)
    }
  }

  async delete(resource: JsonApiIdentifier): Promise<void> {
    return (new JsonApiRequest(this.#requestOptions)).delete(resource)
  }
}
