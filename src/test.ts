import { Download, requestUtils } from './index'

const request = new Download('http://localhost:3000')

request.post('/users', {}).then((result) => {
  console.log(result)
})

// request.get('/users').then((result) => {
//   console.log(result)
// })
