import { Resource, JsonApiResource, JsonApiInfo } from "./types"
import { BaseInfo } from "./BaseInfo"

export class BaseResource implements Resource {
  readonly type: string
  readonly id: string
  readonly _jsonapi: JsonApiInfo

  [field: string]: any

  constructor(data: Partial<JsonApiResource>) {
    this.type = data.type ?? ''
    this.id = data.id ?? ''
    this._jsonapi = new BaseInfo(this)
    this._jsonapi.merge(data)
    Object.defineProperty(this, '_jsonapi', { enumerable: false, })
  }
}
