import { header } from './interface'

export interface rangeOptions {
  size: number
  url?: string
  header?: header
}

class RangeDownload {
  downloadIng: boolean = false
  progress: number | null = 0
  options: rangeOptions = { size: 1024 * 512, header: {}, url: '' }
  constructor(options: rangeOptions) {
    if (options.size) {
      this.options.size = options.size
    }
    if (options.header) {
      this.options.header = options.header
    }
    if (options.url) {
      options.url
    }
  }

  async downloadBlob(url: string, size: number, filename: string) {
    if (this.downloadIng || this.progress) return
    try {
      const link: string = `${this.options.url || ''}${url}`
      this.downloadIng = true
      this.progress = 0

      const CHUNK_SIZE = this.options.size // 每次下载1MB
      const response: header = size ? { headers: null } : await fetch(link)

      this.progress = 1
      const contentRange = response?.headers?.get('content-range') || {}
      //获取下载文件大小
      const fileSize = size ? size : contentRange ? Number(contentRange.split('/')[1]) : response?.headers?.get('content-length')

      const fileStream: Array<Blob> = []
      let offset: number = 0
      let fileType: string = ''

      //进行分片
      while (offset < fileSize) {
        const end: number = Math.min(offset + CHUNK_SIZE, fileSize)

        const options: header = Object.assign(
          {
            headers: { Range: `bytes=${offset}-${end - 1}` }
          },
          this.options.header
        )

        //不加await，文件大也会下载很快，但是下载后的文件打开无效，必须加await
        const blob = await fetch(link, options).then((res) => res.blob())

        if (!fileType) fileType = blob.type

        fileStream.push(blob)

        offset = end

        const p: number = Math.floor((offset / fileSize) * 100)

        this.progress = p || 1
      }
      //结束后，组装分片
      const blob = new Blob(fileStream, { type: fileType })
      //保存，触发浏览器的下载窗口
      this.saveAs(blob, filename)
      this.progress = null
    } catch (e) {
      this.progress = null
      this.downloadIng = false
    }
  }

  //保存
  saveAs(blob: Blob, filename: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    this.downloadIng = false
    a.download = filename
    a.click()
  }
}

export default RangeDownload
