import { Campuses, Halls, Department, ActivityType, ReviewStatus } from './StaticData'
import { parseTime } from './index'

function filterParams(data) {
  const params = {}
  const keys = Object.keys(data)
  for (const item of keys) {
    if (data[item] === '' || data[item] === undefined || data[item] === null) {
      continue
    }
    params[item] = data[item]
  }

  return params
}

function transParams(params) {
  if (params.activityDepartment !== '') {
    for (const item in Department) {
      if (Department[item] === params.activityDepartment) {
        params.activityDepartment = item * 1
        break
      }
    }
  }
  if (params.applyDepartment !== '') {
    for (const item in Department) {
      if (Department[item] === params.applyDepartment) {
        params.applyDepartment = item * 1
        break
      }
    }
  }
  if (params.campus !== '') {
    for (const item in Campuses) {
      if (Campuses[item] === params.campus) {
        params.campus = item * 1
        break
      }
    }
  }
  if (params.reviewStatus !== '') {
    for (const item in ReviewStatus) {
      if (ReviewStatus[item] === params.reviewStatus) {
        params.reviewStatus = item * 1
        break
      }
    }
  }
  if (params.reserveHall !== '') {
    for (const item in Halls) {
      if (Halls[item] === params.reserveHall + '') {
        params.reserveHall = item * 1
        break
      }
    }
  }
  if (params.activityType !== '') {
    for (const item in ActivityType) {
      if (ActivityType[item] === params.activityType) {
        params.activityType = item * 1
        break
      }
    }
  }

  return params
}

function dateToTimestamp(params) {
  const specialList = ['date', 'arrangeDate', 'formalDate', 'rehearsalDate']
  for (const key of Object.keys(params)) {
    if (specialList.indexOf(key) !== -1) {
      params[key] = parseTime(params[key], '{y}/{m}/{d}')
    } else if (params[key] instanceof Date) {
      params[key] = parseTime(params[key])
    }
  }
  return params
}

export default function formatParams(params) {
  return dateToTimestamp(filterParams(transParams(params)))
}
