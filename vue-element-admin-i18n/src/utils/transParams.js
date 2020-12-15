import { Campuses, Halls, Department, ActivityType, ReviewStatus } from './StaticData'

export function transParams(params) {
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
