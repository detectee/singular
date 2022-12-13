import { JsonApiIdentifier, JsonApiInfo, JsonApiResource, JsonApiValues, Resource } from "./types";

export class BaseInfo implements JsonApiInfo {
  #resource: Resource

  constructor(resource: Resource) {
    this.#resource = resource
  }

  getAttributes(): JsonApiValues {
    const result: JsonApiValues = {}
    Object.keys(this.#resource).forEach((name: any) => {
      if (['id', 'type', '_jsonapi'].includes(name)) {
        return
      }
      result[name] = this.#resource[name]
    })
    return result
  }

  identifier(): JsonApiIdentifier {
    return { type: this.#resource.type, id: this.#resource.id }
  }

  merge(data: Partial<JsonApiResource>): void {
    if ('attributes' in data) {
      Object.keys(data.attributes ?? []).forEach((name: string) => {
        if (['id','type','_jsonapi'].includes(name)) {
          return
        }
        this.#resource[name] = data.attributes ? data.attributes[name] : undefined
      })
    }
  }
}
