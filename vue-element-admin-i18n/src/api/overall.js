import request from '@/utils/request'
import { filterParams } from '@/utils/filterParams'
import { transParams } from '@/utils/transParams'

export function filterTimeTable(params) {
  return request({
    url: '/Apply/ApplyStatus',
    method: 'get',
    params: transParams(filterParams(params))
  })
}
