import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { Department, Authority } from '../utils/StaticData'

export function fetchUserList(query = {}) {
  return request({
    url: '/vue-element-admin/user/user-list',
    method: 'get',
    params: query
  })
}

export function login(data) {
  return request({
    url: '/Login',
    method: 'get',
    params: filterParams(data)
  })
}

/* 获取当前用户信息 */
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

/* 修改管理员等级 */
export function changeAdminLevel(data) {
  return request({
    url: '/Admin/UpdateUser',
    method: 'get',
    params: filterParams(data)
  })
}

/* 设置为管理员 */
export function setAdmin(UserID, UserName) {
  return request({
    url: '',
    method: 'post',
    data: {
      UserID,
      UserName
    }
  })
}

/* 删除管理员 */
export function deleteAdmin(params) {
  return request({
    url: '',
    method: 'get',
    params: filterParams(params)
  })
}

/* 获取管理员名单 */
export function getAdminList(data) {
  return request({
    url: '/Admin/UserList',
    method: 'get',
    params: filterParams(data)
  })
}

export function userFilter(data) {
  if (data.department !== '') {
    for (const item in Department) {
      if (Department[item] === data.department) {
        data.department = item * 1
        break
      }
    }
  }
  if (data.authority !== '') {
    for (const item in Authority) {
      if (Authority[item] === data.authority) {
        data.authority = item * 1
        break
      }
    }
  }
  return request({
    url: '/Admin/UserFilter',
    method: 'get',
    params: filterParams(data)
  })
}

/* 更新当前用户账户信息 */
export function updateAccount(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}
