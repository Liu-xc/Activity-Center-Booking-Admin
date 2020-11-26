import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { Department } from '../utils/StaticData'
// import { delete } from 'vue/types/umd'

export function approve(params) {
  return request({
    url: '/Approval/Approve',
    method: 'get',
    params: filterParams(params)
  })
}

export function filterApprove(data) {
  if (data.reserveDepartment !== '') {
    for (const item in Department) {
      if (Department[item] === data.reserveDepartment) {
        data.reserveDepartment = item * 1
        break
      }
    }
  }
  return request({
    url: '/Approval/ApproveFilter',
    method: 'get',
    params: filterParams(data)
  })
}

