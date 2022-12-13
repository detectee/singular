export type JsonApiValues = {
  [key: string]: any
}

export interface JsonApiDocument {
  data: JsonApiResource | JsonApiResource[]
  included?: JsonApiResource[]
  meta?: JsonApiValues
  links?: JsonApiValues
}

export interface JsonApiIdentifier<Type extends string = string> {
  type: Type
  id: string
}

export interface JsonApiResource extends JsonApiIdentifier {
    attributes?: JsonApiValues
    relationships?: JsonApiRelationships
    meta?: JsonApiValues
    links?: JsonApiValues
}

export interface JsonApiRelationships {
  [relationName: string]: JsonApiRelationship;
}

export interface JsonApiRelationship {
  data?: JsonApiIdentifier | JsonApiIdentifier[] | null;
  meta?: JsonApiValues;
  links?: JsonApiValues;
}

export interface JsonApiInfo {
  identifier(): JsonApiIdentifier
  merge(data: Partial<JsonApiResource>): void
  getAttributes(): JsonApiValues
}

export interface FindOptions {
  filter?: string
  pageOffset?: string
  pageLimit?: string
  sort?: string
}

export interface Resource extends JsonApiIdentifier {
  _jsonapi: JsonApiInfo
  [field: string]: any
}

export interface Repository {
  findOne(identifier: JsonApiIdentifier): Promise<Resource | null>
  findOne(type: string, id: string): Promise<Resource | null>
  find(identifiers: JsonApiIdentifier[], options?: FindOptions): Promise<Resource[]>
  find(type: string, options?: FindOptions): Promise<Resource[]>
  create(type: string, id: string, attributes: JsonApiValues): Resource
  persist(resource: Resource): Promise<void>
  delete(identifier: JsonApiIdentifier): Promise<void>
}
