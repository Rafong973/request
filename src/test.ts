import Request, { requestMethod } from './index'

const request = new Request('https://developer.mozilla.org')

request.get('/zh-CN/docs/Web/API/URLSearchParams/append', [1, 1, 1, 1])
