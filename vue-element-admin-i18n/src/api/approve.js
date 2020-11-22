import request from '@/utils/request'

export function approve(params) {
  return request({
    url: '/Approval/Approve',
    method: 'post',
    data: params
  })
}

export function filterApprove(params) {
  return request({
    url: '/Approval/ApproveFilter',
    method: 'get',
    params
  })
}
