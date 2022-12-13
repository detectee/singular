import { JsonApiDocument, JsonApiIdentifier, JsonApiResource, Resource } from "./types"
import { BaseResource } from "./BaseResource"

type ResourceVault = {
  [type: string]: {
      [id: string]: Resource
  }
}

export class JsonApiStore {
  private vault: ResourceVault = {}

  public getOne(identifier: JsonApiIdentifier): Resource {
    return this.vault[identifier.type][identifier.id]
  }

  public get(identifiers: JsonApiIdentifier[]): Resource[] {
    return identifiers.map((identifier: JsonApiIdentifier) => this.getOne(identifier))
  }

  public getAll(type: string): Resource[] {
    if (!this.vault[type]) {
        return []
    }
    return Object.keys(this.vault[type]).map((id) => this.vault[type][id])
  }

  public sync(document: JsonApiDocument): Resource[] {
    const syncResource = this.syncResource.bind(this)
    if ('included' in document) {
        document.included?.map(syncResource)
    }
    return Array.isArray(document.data) ? document.data.map(syncResource): [syncResource(document.data)]
  }

  public syncResource(data: JsonApiResource): Resource {
    const { type, id } = data
    this.vault[type] = this.vault[type] || {}
    if (this.vault[type][id]) {
        this.vault[type][id]._jsonapi.merge(data)
    } else {
        this.vault[type][id] = new BaseResource(data)
    }
    return this.vault[type][id]
  }

  public forget(data: JsonApiIdentifier): void {
    delete this.vault[data.type][data.id]
  }

  public reset(): void {
    this.vault = {}
  }
}
