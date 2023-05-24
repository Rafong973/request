## IM 下载资源工具

### 安装

```bash
npm install sasai-resource
```

### 使用

```javascript
import LoadIMResource from 'sasai-resource'

/**
 * 依顺序写入参数
 * @param param
 * @param sign
 * @param open_uid
 */
const loadIMResource = new LoadIMResource('', '', '')

// 调用下载方法，默认返回Base64
loadIMResource
  .download(
    'https://filetest.im.sasai.mobi:44362/fileservice/download/img?type=1&filekey=group2/M00/20/5D/wKgDTmIoBC-ABayHAAAyTu9eEd4442.jpg'
  )
  .then((result) => {
    console.log(result)
  })

// 转换成formaData 数据
loadIMResource.toFormData()
```
