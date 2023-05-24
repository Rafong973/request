export enum requestMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export interface header {
  [propName: string]: any
}
export interface requestConfig {
  type?: XMLHttpRequestResponseType
  headers?: header | null
}

class Request {
  private baseURL: string
  constructor(base: string | null) {
    if (base != null) {
      this.baseURL = base
    }
  }
  async blob(url: string | URL, type: XMLHttpRequestResponseType = 'blob'): Promise<unknown> {
    if (!url) return Promise.reject(null)
    const result = await this.request(url, requestMethod.post, { type }).catch((e) => {
      throw new Error(e)
    })
    const file = await this.fileReader(result as Blob, type)
    return file
  }
  request(url: string | URL, method: requestMethod, config: requestConfig) {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest()
        xhr.open(method, this.baseURL + url, true)
        xhr.responseType = config.type || 'json'
        if (config.headers) {
          Object.keys(config.headers).forEach((h) => {
            xhr.setRequestHeader(h, config.headers[h])
          })
        }

        xhr.onload = async (e) => {
          if (xhr.status == 200) {
            resolve(xhr.response)
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

        xhr.send()
      } catch (error) {
        throw new Error(error)
      }
    })
  }
  /**
   *  新建一个文件读取方法
   * @param {*} file 文件链接
   * @param {*} type 文件类型: blob/buffer
   * @returns 文件
   */
  async fileReader(file: Blob, type = 'blob'): Promise<Buffer | Blob> {
    return new Promise((resolve) => {
      const fileEncode: FileReader = new FileReader()
      switch (type) {
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
