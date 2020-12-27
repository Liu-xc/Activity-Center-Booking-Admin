import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import formatParams from '@/utils/formatParams'

export function approve(params) {
  return request({
    url: '/Approval/Approve',
    method: 'get',
    params: filterParams(params)
  })
}

export function filterApprove(data) {
  return request({
    url: '/Approval/ApproveFilter',
    method: 'get',
    params: formatParams(data)
  })
}

