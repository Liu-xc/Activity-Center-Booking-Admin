import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'

export function getExcel(query = {}) {
  return request({
    url: '/Approval/ExportExcel',
    method: 'get',
    params: filterParams(query)
  })
}
