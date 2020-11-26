import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { ErrorCodes } from './errorCodes'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    const userinfo = store.getters.userinfo
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['authority'] = userinfo.authority * 1
    config.headers['department'] = userinfo.department * 1
    config.headers['name'] = encodeURIComponent(userinfo.name)
    config.headers['uid'] = userinfo.uid * 1
    config.headers['workId'] = userinfo.workId * 1
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 在响应拦截中做错误提醒
    if (res.code + '' !== '200') {
      console.log(res)
      Message({
        message: ErrorCodes && ErrorCodes[res.code + ''] || '未知异常',
        type: 'error',
        duration: 3 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
