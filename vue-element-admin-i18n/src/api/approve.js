import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { transParams } from '../utils/transParams'

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
    params: filterParams(transParams(data))
  })
}

