export enum requestMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export const testMethod = (value: any): value is requestMethod => Object.values(requestMethod).includes(value)

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

/**
 * @description: 对象转query串
 * @param {*} obj
 * @param {*} noFilterEmpty 默认false 去除空值再拼接字符串
 * @return {*}
 */
export const getQueryString = (obj: obj, noFilterEmpty: boolean = false): String => {
  if (!obj) return ''
  let newObj = { ...obj }
  if (!noFilterEmpty) {
    newObj = filterParams(newObj)
  }
  return new URLSearchParams(Object.entries(newObj)).toString()
}

/**
 * @description: 去除对象中的空值
 * @param {*} obj
 * @return {*}
 */
export const filterParams = (obj: obj): obj => {
  let newObj: obj = {}
  for (const key in obj) {
    //如果对象属性的值不为空，就保存该属性（如果属性的值为0 false，保存该属性。如果属性的值全部是空格，属于为空。）
    if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

class Request {
  private baseURL: string
  private baseConfig: requestConfig

  constructor(base?: string | null, config?: requestConfig) {
    if (base != null) {
      this.baseURL = base
    }
    if (config) {
      if (config.headers) {
        this.baseConfig.headers = config.headers || {}
      }
      if (config.type) {
        this.baseConfig.type = config.type || 'json'
      }
      this.baseConfig = config
    }
  }
  async blob(url: string | URL, type: XMLHttpRequestResponseType = 'blob'): Promise<unknown> {
    if (!url) return Promise.reject(null)
    const result = await this.request(url, requestMethod.post, '', { type }).catch((e) => {
      throw new Error(e)
    })
    const file = await this.fileReader(result as Blob, type)
    return file
  }
  get(url: string, data?: obj | null, config?: requestConfig) {
    if (data) {
      url = url.replace(/\?/gi, '')
      url += `?${getQueryString(data)}`
    }
    return this.request(url, requestMethod.get, null, config)
  }
  post(url: string, data: obj, config?: requestConfig) {
    const body = JSON.stringify(data)
    return this.request(url, requestMethod.post, body, config)
  }
  request(url: string | URL, method: string, data?: Document | XMLHttpRequestBodyInit, config?: requestConfig): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        if (!testMethod(method)) throw new Error('不支持的请求方法')

        const xhr = new XMLHttpRequest()

        xhr.open(method.toLocaleUpperCase(), this.baseURL + url, true)

        xhr.responseType = config?.type || 'text'

        if (config?.headers) {
          Object.keys(config.headers).forEach((h) => {
            xhr.setRequestHeader(h, config.headers[h])
          })
        }

        if (!config?.headers?.contentType) {
          xhr.setRequestHeader('Content-Type', 'application/json')
        }
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

        xhr.withCredentials = true

        xhr.onload = async () => {
          if (xhr.status === 200) {
            let data = xhr.response
            if (xhr.responseType === 'text') {
              try {
                data = JSON.parse(data)
              } catch (error) {}
            }
            resolve(data)
          } else {
            reject(xhr)
          }
        }

        xhr.onabort = (e) => {
          reject(e)
        }

        xhr.onerror = async (e) => {
          reject(e)
        }

        if (data) {
          if (method === requestMethod.get) {
          }
        }

        xhr.send(data)
      } catch (error) {
        throw new Error(error)
      }
    })
  }
  /**
   *  新建一个文件读取方法
   * @param {*} file 文件链接
   * @param {*} fileType 文件类型: blob/buffer
   * @returns 文件
   */
  async fileReader(file: Blob, fileType = 'blob'): Promise<Buffer | Blob> {
    return new Promise((resolve) => {
      const fileEncode: FileReader = new FileReader()
      switch (fileType) {
        case 'blob':
        default:
          fileEncode.readAsDataURL(file)
          break
        case 'buffer':
          fileEncode.readAsArrayBuffer(file)
          break
      }
      fileEncode.onload = function (e: any) {
        // 显示图片发放
        resolve(e.target.result)
      }
    })
  }

  // 转成formdata
  toFormData(file: Blob | string, name = 'file', filename = new Date().valueOf().toString()) {
    const formData = new FormData()
    formData.append(name, file, filename)
    return formData
  }
}

export default Request
