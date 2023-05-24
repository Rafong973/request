import Request, { requestMethod } from './index'

const request = new Request('')

// request.get('sss', { name: 1 })
request.post('sss', [1, 1, 1, 1])
