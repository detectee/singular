import { FindOptions, JsonApiDocument, JsonApiIdentifier, Resource } from "./types"

export class JsonApiRequest {
  constructor(private api: string) { }

  async queryOne(type: string, id: string, options?: FindOptions) {
    const paramstr = options ? paramsToQuery(this.optionsToParams(options)) : ''
    return fetchJsonApi(`${this.api}/${type}/${id}${paramstr ? '?' : ''}${paramstr}`)
  }

  async queryAll(type: string, options?: FindOptions) {
    const paramstr = options ? paramsToQuery(this.optionsToParams(options)) : ''
    return fetchJsonApi(`${this.api}/${type}${paramstr ? '?' : ''}${paramstr}`)
  }

  async create(resource: Resource) {
    return fetchJsonApi(`${this.api}/${resource.type}`, {
      method: 'POST',
      body: {
        data: {
          type: resource.type,
          attributes: resource._jsonapi.getAttributes(),
        },
      },
    })
  }

  async update(resource: Resource) {
    return fetchJsonApi(`${this.api}/${resource.type}/${resource.id}`, {
      method: 'PATCH',
      body: {
        data: {
          type: resource.type,
          id: resource.id,
          attributes: resource._jsonapi.getAttributes(),
        },
      },
    })
  }

  async delete(identifier: JsonApiIdentifier) {
    return fetchJsonApi(`${this.api}/${identifier.type}/${identifier.id}`, {
      method: 'DELETE',
    })
  }

  optionsToParams(options: FindOptions): any {
    const params: any = {}
    if (options.filter) params['filter'] = options.filter
    if (options.sort) params['sort'] = options.sort
    if (options.pageLimit) params['page[limit]'] = options.pageLimit
    if (options.pageOffset) params['page[offset]'] = options.pageOffset
    return params
  }
}

export async function fetchJsonApi(uri: string, options: any = {}) {
  options.headers = options.headers || {}
  options.headers['Accept'] = 'application/vnd.api+json'

  if (options.body) {
    options.body = JSON.stringify(options.body)
    options.headers['Content-Type'] = 'application/vnd.api+json'
  }

  const response = await fetch(uri, options)

  if (response.ok) {
    if (response.status === 200) {
      return await response.json()
    } else {
      return {}
    }
  } else {
    throw new Error(response.statusText)
  }
}

function paramsToQuery(params: any): string {
  return Object.entries<any>(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => fixedEncodeURIComponent(k) + '=' + fixedEncodeURIComponent(v))
    .join('&')
}

function fixedEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}
