import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { transParams } from '../utils/transParams'

export function newApply(params) {
  return request({
    url: '/Apply/AddApply ',
    method: 'post',
    data: filterParams(params)
  })
}

/* 通过前端传入的日期返回查询到的当日学生活动中心全部预约情况（用于日历时间轴展示） */
export function applyOverall(params) {
  return request({
    url: '/Apply/ApplyStatus',
    method: 'post',
    data: filterParams(params)
  })
}

/* 通过前端传入的过滤条件返回查询到符合条件的登录用户的预约情况 */
export function filterMyRequest(params) {
  /* 将数据转换（校区、审核状态、活动类别、厅） */
  return request({
    url: 'Apply/ApplyStatusFilter',
    method: 'post',
    data: filterParams(transParams(params))
  })
}

/* 前端传入预约申请表的各参数至后端数据库持久存储 */
export function updateApply(params) {
  return request({
    url: '/Apply/UpdateApply',
    method: 'post',
    data: filterParams(params)
  })
}

/* 前端传入预约申请表序号至后端数据库删除记录 */
export function deleteApply(params) {
  return request({
    url: '/Apply/DeleteApply',
    method: 'post',
    data: filterParams(params)
  })
}

/* 前端传入预约申请序号从后端导出该申请表的Excel文件 */
export function exportExcel(params) {
  return request({
    url: '/Apply/ExportExcel',
    method: 'get',
    params: filterParams(params)
  })
}

/* 从前端上传图片至后端服务器目录持久保持 */
export function uploadImage(data) {
  return request({
    url: '/Apply/UploadImage',
    method: 'post',
    data
  })
}

/* 后端服务器删除前端传入的指定路径的图片文件 */
export function deleteImage(data) {
  return request({
    url: '/Apply/DeleteImage',
    method: 'post',
    data
  })
}
