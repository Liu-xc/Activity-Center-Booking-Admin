import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { Department, ReviewStatus, Campuses } from '../utils/StaticData'
// import { delete } from 'vue/types/umd'

export function approve(params) {
  return request({
    url: '/Approval/Approve',
    method: 'get',
    params: filterParams(params)
  })
}

export function filterApprove(data) {
  if (data.activityDepartment !== '') {
    for (const item in Department) {
      if (Department[item] === data.activityDepartment) {
        data.activityDepartment = item * 1
        break
      }
    }
  }
  if (data.campus !== '') {
    for (const item in Campuses) {
      if (Campuses[item] === data.campus) {
        data.campus = item * 1
        break
      }
    }
  }
  if (data.reviewStatus !== '') {
    for (const item in ReviewStatus) {
      if (ReviewStatus[item] === data.reviewStatus) {
        data.reviewStatus = item * 1
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

