import request from '@/utils/request'
// import { filterParams } from '@/utils/filterParams'

export function getExcel(aid) {
  return request({
    url: '/Apply/DownloadWord',
    method: 'get',
    params: {
      aid: aid
    }
  })
}
