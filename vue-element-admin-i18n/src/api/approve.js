import request from '@/utils/request'

export function approve(params, headers = {}) {
  return request({
    url: '/Approval/Approve',
    method: 'post',
    headers,
    data: params
  })
}

export function filterApprove(data, headers = {}) {
  return request({
    url: '/Approval/ApproveFilter',
    method: 'post',
    headers,
    data
  })
}
