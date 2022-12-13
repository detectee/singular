export * from './JsonApi/types'
export * from './JsonApi/JsonApiStore'
export * from './JsonApi/JsonApiRequest'

import { Resource } from './JsonApi/types'
import { BaseResource } from './JsonApi/BaseResource'

export function nullResource(): Resource {
  return new BaseResource({})
}
