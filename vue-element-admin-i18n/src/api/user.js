import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/vue-element-admin/user/user-list',
    method: 'get',
    params: query
  })
}

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
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
    method: 'post',
    data
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
export function deleteAdmin(UserID, UserName) {
  return request({
    url: '',
    method: 'post',
    data: {
      UserID,
      UserName
    }
  })
}

/* 获取管理员名单 */
export function getAdminList(params) {
  return request({
    url: '/Admin/UserList',
    method: 'get',
    params
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
