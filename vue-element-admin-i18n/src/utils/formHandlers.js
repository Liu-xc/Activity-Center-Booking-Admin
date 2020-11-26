// function handleCampusAndHalls(ctx) {
//   /* 判断校区和hall的关系 */
//   if (ctx.listQuery.Campus) {
//     /* 如果设置了校区 */
//     const index = ctx.Campuses.indexOf(ctx.listQuery.Campus)
//     ctx.halls = index === 0 ? ctx.QSHalls : ctx.SHHalls
//   } else if (ctx.listQuery.ReserveHall) {
//     /* 如果设置了厅 */
//     if (ctx.QSHalls.includes(ctx.listQuery.ReserveHall)) {
//       ctx.listQuery.Campus = ctx.Campuses[0]
//       ctx.campuses = [ctx.Campuses[0]]
//     } else if (ctx.SHHalls.includes(ctx.listQuery.ReserveHall)) {
//       ctx.listQuery.Campus = ctx.Campuses[1]
//       ctx.campuses = [ctx.Campuses[1]]
//     }
//   } else {
//     ctx.halls = ctx.Halls
//     ctx.campuses = ctx.Campuses
//   }
// }

function handleFilter(ctx, callback = undefined) {
  // 做一个防抖
  if (ctx.searchTimer) {
    clearTimeout(ctx.searchTimer)
  }
  ctx.searchTimer = setTimeout(() => {
    ctx.listQuery.displayPage = 1
    callback && callback()
    clearTimeout(ctx.searchTimer)
    ctx.searchTimer = null
  }, 1000)
}

export { handleFilter }
