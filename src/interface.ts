export enum requestMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export interface header {
  [propName: string]: any
}

export interface obj {
  [propName: string]: any
}
export interface requestConfig {
  type?: XMLHttpRequestResponseType
  headers?: header | null
}
