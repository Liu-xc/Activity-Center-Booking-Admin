import request from '@/utils/request'

export function approve(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  })
}

export function filterApprove(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
