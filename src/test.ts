import Request, { requestMethod } from './index'

const request = new Request('http://localhost:3000')

request.post('/users', {}).then((result) => {
  console.log(result)
})

// request.get('/users').then((result) => {
//   console.log(result)
// })
